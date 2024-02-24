const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

var win;

const createWindow = () => {
  // set timeout to render the window not until the Angular
  // compiler is ready to show the project
  setTimeout(() => {
    // Create the browser window.
    win = new BrowserWindow({
      show: false,
      width: 1200,
      height: 1000,
      icon: "./src/favicon.ico",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
        // sandbox: false,
      },
    });

    win.loadURL(
      url.format({
        pathname: "../dist/span-calculator/index.html",
        protocol: "file:",
        slashes: true,
      })
    );

    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on("closed", () => {
      win = null;
    });

    win.once("ready-to-show", () => {
      win.show();
    });
  }, 10000);
};

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  console.log("window-all-closed");
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("getFiles", () => {
  const files = fs.readdirSync(__dirname);
  win.webContents.send("getFilesResponse", files);
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

console.log(`Dirname: ${__dirname}\n`);
