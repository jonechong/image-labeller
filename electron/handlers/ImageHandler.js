const fs = require("fs");
const path = require("path");

class ImageHandler {
    readImageFiles(event, folderPath) {
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
    }

    async deleteImageFile(event, filePath) {
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
    }
}

module.exports = ImageHandler;
