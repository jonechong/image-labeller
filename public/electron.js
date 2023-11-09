const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const ipcHandlers = require("./ipcHandlers");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
        },
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

ipcMain.handle("open-directory-dialog", ipcHandlers.openDirectoryDialog);
ipcMain.handle("read-image-files", ipcHandlers.readImageFiles);
