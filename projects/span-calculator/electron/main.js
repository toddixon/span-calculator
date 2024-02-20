"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var url = require("url");
var fs = require("fs");
var win;
function createWindow() {
    // set timeout to render the window not until the Angular 
    // compiler is ready to show the project
    setTimeout(function () {
        // Create the browser window.
        win = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            icon: './src/favicon.ico'
        });
        setTimeout(function () {
            // and load the app.
            win.loadURL(url.format({
                pathname: 'localhost:4200',
                protocol: 'http:',
                slashes: true
            }));
        }, 3000);
        win.webContents.openDevTools();
        // Emitted when the window is closed.
        win.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            win = null;
        });
    }, 10000);
}
electron_1.app.on("ready", createWindow);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.ipcMain.on('getFiles', function () {
    var files = fs.readdirSync(__dirname);
    win.webContents.send('getFilesResponse', files);
});
electron_1.app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
