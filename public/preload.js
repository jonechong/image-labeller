const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    openDirectoryDialog: () => ipcRenderer.invoke("open-directory-dialog"),
    readImageFiles: (folderPath) =>
        ipcRenderer.invoke("read-image-files", folderPath),
    deleteImageFile: (filePath) =>
        ipcRenderer.invoke("delete-image-file", filePath),
});
