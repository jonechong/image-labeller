const fs = require("fs");
const sharp = require("sharp");
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

    // Helper function to asynchronously get image dimensions
    getImageDimensions = async (imagePath) => {
        try {
            const image = sharp(imagePath);
            const metadata = await image.metadata();
            return { width: metadata.width, height: metadata.height };
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
    processToCOCOFormat = async (boundingBoxData, folderName) => {
        const cocoData = {
            images: [],
            annotations: [],
            categories: [],
        };

        const categoryMap = {};
        let categoryIdCounter = 1;
        let annotationIdCounter = 1;

        for (const data of boundingBoxData) {
            const { height, width, x, y, label, image } = data;
            const imageId = generateImageId(image);

            // Check if image is already processed
            if (!cocoData.images.some((img) => img.id === imageId)) {
                // Obtain image dimensions
                const { width: imgWidth, height: imgHeight } =
                    await getImageDimensions(image);

                cocoData.images.push({
                    id: imageId,
                    file_name: path.basename(image),
                    width: imgWidth,
                    height: imgHeight,
                });
            }

            if (!categoryMap[label]) {
                categoryMap[label] = categoryIdCounter++;
                cocoData.categories.push({
                    id: categoryMap[label],
                    name: label,
                });
            }

            cocoData.annotations.push({
                id: annotationIdCounter++,
                image_id: imageId,
                category_id: categoryMap[label],
                bbox: [x, y, width, height],
            });
        }

        const filename = `${folderName.toLowerCase()}.json`;
        const filePath = path.join(folderName, filename);

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
