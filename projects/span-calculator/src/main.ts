import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { provideAnimations } from '@angular/platform-browser/animations';

// const electron = require('electron')
// const fs = require('fs');
// const ipc = electron.ipcMain;
// const shell = electron.shell;

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    provideAnimations(),
  ]
})
  .catch(err => console.error(err));
