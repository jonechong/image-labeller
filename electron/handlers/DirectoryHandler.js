const { dialog } = require("electron");
const fs = require("fs");
const path = require("path");

class DirectoryHandler {
    async openDirectoryDialog() {
        const { filePaths } = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });
        return filePaths[0];
    }

    async validateDirectory(event, folderPath) {
        return fs.existsSync(folderPath);
    }

    async createFolder(event, currentPath, folderName) {
        const cleanCurrentPath = currentPath.startsWith("file://")
            ? decodeURI(currentPath.replace("file://", ""))
            : currentPath;
        const folderPath = path.join(cleanCurrentPath, folderName);

        try {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                return { success: true };
            } else {
                return { success: false, error: "Folder already exists." };
            }
        } catch (error) {
            console.error(`Error creating folder: ${error}`);
            return { success: false, error: error.message };
        }
    }
}

module.exports = DirectoryHandler;
