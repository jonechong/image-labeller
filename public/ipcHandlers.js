const { dialog } = require("electron");
const fs = require("fs");
const path = require("path");

const readImageFiles = async (event, folderPath) => {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files
        .filter((file) => {
            return [".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(
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

const openDirectoryDialog = async (event) => {
    // Opens a dialog to select directories only
    const { filePaths } = await dialog.showOpenDialog({
        properties: ["openDirectory"],
    });
    return filePaths[0]; // returns the selected directory path
};

const deleteImageFile = async (event, filePath) => {
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

// Export other handlers similarly
module.exports = {
    openDirectoryDialog,
    readImageFiles,
    deleteImageFile,
};
