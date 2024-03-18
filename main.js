const { app, BrowserWindow } = require("electron");
var win;

if (require('electron-squirrel-startup')) app.quit();

const createWindow = () => {
    win = new BrowserWindow({
      show: false,
      width: 1200,
      height: 1000,
      icon: "./images/icons/iconR.ico",
    });

    win.loadFile('dist/span-calculator/index.html')

    // win.webContents.openDevTools();

    win.on("closed", () => {
      win = null;
    });

    win.once("ready-to-show", () => {
      win.show();
    });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  console.log("window-all-closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
