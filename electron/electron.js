const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

//import handlers
const DirectoryHandler = require("./handlers/DirectoryHandler");
const ImageHandler = require("./handlers/ImageHandler");
const DownloadHandler = require("./handlers/DownloadHandler");
const directoryHandler = new DirectoryHandler();
const downloadHandler = new DownloadHandler();
const imageHandler = new ImageHandler();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            devTools: process.env.NODE_ENV !== "production",
        },
        autoHideMenuBar: true, // Add this line
    });

    const startUrl = isDev
        ? "http://localhost:3000" // Dev URL
        : `file://${path.join(__dirname, "../build/index.html")}`; // Prod URL
    mainWindow.loadURL(startUrl);

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});

//Directory Handlers
ipcMain.handle("open-directory-dialog", directoryHandler.openDirectoryDialog);
ipcMain.handle("validate-directory", directoryHandler.validateDirectory);
ipcMain.handle("create-folder", directoryHandler.createFolder);
ipcMain.handle("copy-file-to-directory", directoryHandler.copyFileToDirectory);

//Download Handlers
ipcMain.handle("fetch-image-urls", downloadHandler.fetchImageUrls);
ipcMain.handle("download-images", downloadHandler.downloadImages);

// Image Handlers
ipcMain.handle("read-image-files", imageHandler.readImageFiles);
ipcMain.handle("delete-image-file", imageHandler.deleteImageFile);
