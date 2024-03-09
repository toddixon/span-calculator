const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

var win;

const createWindow = () => {
  // set timeout to render the window not until the Angular
  // compiler is ready to show the project
  setTimeout(() => {
    win = new BrowserWindow({
      show: false,
      width: 1200,
      height: 1000,
      icon: "./src/favicon.ico",
    });

    win.loadFile('dist/span-calculator/index.html')

    // win.webContents.openDevTools();

    win.on("closed", () => {
      win = null;
    });

    win.once("ready-to-show", () => {
      win.show();
    });
  }, 4000);
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  console.log("window-all-closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("getFiles", () => {
  const files = fs.readdirSync(__dirname);
  win.webContents.send("getFilesResponse", files);
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

console.log(`Dirname: ${__dirname}\n`);
