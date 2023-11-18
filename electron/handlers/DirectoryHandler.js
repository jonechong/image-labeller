const { dialog } = require("electron");
const fs = require("fs");

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

    async createFolder(event, folderPath) {
        return fs.mkdirSync(folderPath);
    }
}

module.exports = DirectoryHandler;
