const fs = require("fs");
const Jimp = require('jimp');
const path = require("path");
const crypto = require("crypto");

class ImageHandler {
    readImageFiles = (event, folderPath) => {
        const files = fs.readdirSync(folderPath);
        const imageFiles = files
            .filter((file) => {
                return [".jpg", ".jpeg", ".png", ".bmp", ".webp"].includes(
                    path.extname(file).toLowerCase()
                );
            })
            .map((file) => {
                // Convert to file:// URL
                const filePath = path.join(folderPath, file);
                return `file://${filePath.replace(/\\/g, "/")}`;
            });
        return imageFiles;
    };

    deleteImageFile = async (event, filePath) => {
        try {
            // Decode the URI and remove 'file://' if present
            const decodedPath = decodeURI(filePath.replace("file://", ""));
            // Use trash to move the file to the bin
            const trash = await import("trash");
            await trash.default(decodedPath);
            return { success: true };
        } catch (error) {
            console.error(`Error moving file to trash: ${error}`);
            return { success: false, error: error.message };
        }
    };

    copyImageToDirectory(event, imagePath, destPath) {
        const decodedImagePath = decodeURI(imagePath.replace("file://", ""));
        const decodedDestPath = decodeURI(destPath.replace("file://", ""));
        try {
            fs.copyFileSync(decodedImagePath, decodedDestPath);
            return { success: true };
        } catch (error) {
            console.error(`Error copying file to directory: ${error}`);
            return { success: false, error: error.message };
        }
    }

    getImageDimensions = async (imagePath) => {
        try {
            const image = await Jimp.read(imagePath);
            return { width: image.bitmap.width, height: image.bitmap.height };
        } catch (error) {
            console.error(`Error reading image dimensions: ${error}`);
            return { width: null, height: null };
        }
    };

    // Function to generate a unique hash for image ID
    generateImageId = (imagePath) => {
        return crypto.createHash("md5").update(imagePath).digest("hex");
    };

    // Function to process bounding box data to COCO format
    processToCOCOFormat = async (event, boundingBoxData, folderPath) => {
        const decodedFolderPath = decodeURI(folderPath.replace("file://", ""));
        const folderName = path.basename(decodedFolderPath).toLowerCase();
        const filename = `${folderName}.json`;
        const filePath = path.join(decodedFolderPath, filename);

        let cocoData;
        let categoryMap = {};
        let categoryIdCounter = 1;
        let annotationIdCounter = 1;

        // Check if the JSON file exists and read it
        if (fs.existsSync(filePath)) {
            cocoData = JSON.parse(fs.readFileSync(filePath, "utf8"));

            // Initialize counters and category map from existing data
            cocoData.categories.forEach((cat) => {
                categoryMap[cat.name] = cat.id;
                categoryIdCounter = Math.max(cat.id + 1, categoryIdCounter);
            });

            cocoData.annotations.forEach((ann) => {
                annotationIdCounter = Math.max(ann.id + 1, annotationIdCounter);
            });
        } else {
            // Initialize a new COCO data structure
            cocoData = { images: [], annotations: [], categories: [] };
        }

        // Process each bounding box data
        for (const data of boundingBoxData) {
            const { height, width, x, y, label, image } = data;
            const imageId = this.generateImageId(image);

            // Add image to cocoData if not already present
            if (!cocoData.images.some((img) => img.id === imageId)) {
                const decodedImagePath = decodeURI(
                    image.replace("file://", "")
                );
                const imgDimensions = await this.getImageDimensions(
                    decodedImagePath
                );
                cocoData.images.push({
                    id: imageId,
                    file_name: path.basename(image),
                    width: imgDimensions.width,
                    height: imgDimensions.height,
                });
            }

            // Add category to cocoData if not already present
            if (!categoryMap[label]) {
                categoryMap[label] = categoryIdCounter++;
                cocoData.categories.push({
                    id: categoryMap[label],
                    name: label,
                });
            }

            // Add annotation to cocoData
            cocoData.annotations.push({
                id: annotationIdCounter++,
                image_id: imageId,
                category_id: categoryMap[label],
                bbox: [x, y, width, height],
            });
        }

        // Write updated COCO data back to the file
        try {
            fs.writeFileSync(filePath, JSON.stringify(cocoData, null, 2));
            console.log(`COCO data written to ${filePath}`);
            return { success: true, filePath };
        } catch (error) {
            console.error(`Error writing COCO data to file: ${error}`);
            return { success: false, error: error.message };
        }
    };
}

module.exports = ImageHandler;
