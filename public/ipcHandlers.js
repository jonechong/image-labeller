const { dialog } = require("electron");

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
};
