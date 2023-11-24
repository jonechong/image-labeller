const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    // download functions
    fetchImageUrls: (apiKey, query, start, totalNum, gl, hl, cx, userAgent) => {
        return ipcRenderer.invoke(
            "fetch-image-urls",
            apiKey,
            query,
            start,
            totalNum,
            gl,
            hl,
            cx,
            userAgent
        );
    },
    downloadImages: (imageUrls, folderPath, startNum, userAgent) => {
        return ipcRenderer.invoke(
            "download-images",
            imageUrls,
            folderPath,
            startNum,
            userAgent
        );
    },

    // directory functions
    openDirectoryDialog: () => {
        return ipcRenderer.invoke("open-directory-dialog");
    },
    validateDirectory: (folderPath) => {
        return ipcRenderer.invoke("validate-directory", folderPath);
    },
    createFolder: (currentPath, folderName) => {
        return ipcRenderer.invoke("create-folder", currentPath, folderName);
    },

    // image functions
    readImageFiles: (folderPath) => {
        return ipcRenderer.invoke("read-image-files", folderPath);
    },
    deleteImageFile: (filePath) => {
        return ipcRenderer.invoke("delete-image-file", filePath);
    },
    copyImageToDirectory: (imagePath, destPath) => {
        return ipcRenderer.invoke(
            "copy-image-to-directory",
            imagePath,
            destPath
        );
    },
    processToCOCOFormat: (boundingBoxes, imageDimensions) => {
        return ipcRenderer.invoke(
            "process-to-coco-format",
            boundingBoxes,
            imageDimensions
        );
    },

    // listener things
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => {
            func(...args);
        });
    },

    removeListener: (channel, func) => {
        ipcRenderer.removeListener(channel, func);
    },
});
