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
    copyFileToDirectory: (imagePath, destPath) => {
        return ipcRenderer.invoke(
            "copy-file-to-directory",
            imagePath,
            destPath
        );
    },

    // image functions
    readImageFiles: (folderPath) => {
        return ipcRenderer.invoke("read-image-files", folderPath);
    },
    deleteImageFile: (filePath) => {
        return ipcRenderer.invoke("delete-image-file", filePath);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => {
            func(...args);
        });
    },

    removeListener: (channel, func) => {
        ipcRenderer.removeListener(channel, func);
    },
});
