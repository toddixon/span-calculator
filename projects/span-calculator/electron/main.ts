import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

let win: BrowserWindow | null;

function createWindow (): void {
  // set timeout to render the window not until the Angular 
  // compiler is ready to show the project
  setTimeout(() => {
      // Create the browser window.
      win = new BrowserWindow({
          width: 800,
          height: 600,
          icon: './src/favicon.ico'
      });
      
      setTimeout(() => {
          // and load the app.
          win!.loadURL(url.format({
              pathname: 'localhost:4200',
              protocol: 'http:',
              slashes: true
          }));
      }, 3000);

      win.webContents.openDevTools();

      // Emitted when the window is closed.
      win.on('closed', () => {
          // Dereference the window object, usually you would store windows
          // in an array if your app supports multi windows, this is the time
          // when you should delete the corresponding element.
          win = null;
      });
  }, 10000);
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
      app.quit();
  }
});

ipcMain.on('getFiles', () => {
  const files = fs.readdirSync(__dirname)
  win!.webContents.send('getFilesResponse', files)
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
      createWindow();
  }
});

