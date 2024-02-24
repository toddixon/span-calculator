import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron'

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private ipc!: IpcRenderer;

  constructor() {
    if ((<any>window).require) {
      // try {
      //   this.ipc = (<any>window).require('electron').ipcRenderer
      // } catch (error) {
      //   throw error
      // }
    }
    else {
      // console.warn('Could not load electron ipc')
    }
   }

   async getFiles() {
    return new Promise<string[]>((resolve: any, reject: any) => {
      this.ipc.once("getFilesResponse", (event: any, arg: any) => {
        resolve(arg);
      });
      this.ipc.send("getFiles");
    });
   }
}
