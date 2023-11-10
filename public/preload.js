const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    openDirectoryDialog: () => ipcRenderer.invoke("open-directory-dialog"),
    readImageFiles: (folderPath) =>
        ipcRenderer.invoke("read-image-files", folderPath),
    deleteImageFile: (filePath) =>
        ipcRenderer.invoke("delete-image-file", filePath),
    fetchImageUrls: (apiKey, query, start, totalNum, gl, hl, cx, userAgent) =>
        ipcRenderer.invoke(
            "fetch-image-urls",
            apiKey,
            query,
            start,
            totalNum,
            gl,
            hl,
            cx,
            userAgent
        ),
});
