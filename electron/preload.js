const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    openDirectoryDialog: () => {
        return ipcRenderer.invoke("open-directory-dialog");
    },
    readImageFiles: (folderPath) => {
        return ipcRenderer.invoke("read-image-files", folderPath);
    },
    deleteImageFile: (filePath) => {
        return ipcRenderer.invoke("delete-image-file", filePath);
    },
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
    validateDirectory: (folderPath) => {
        return ipcRenderer.invoke("validate-directory", folderPath);
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
