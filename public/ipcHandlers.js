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

// Export other handlers similarly
module.exports = {
    openDirectoryDialog,
    readImageFiles,
};
