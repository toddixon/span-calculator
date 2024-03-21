const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    icon:'./images/icons/iconR.ico',
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@rabbitholesyndrome/electron-forge-maker-portable',
      config: {
        appId: 'span.calculator.app',
        win: {
          icon: 'C:/Users/trevo/Documents/dev/GitHub/span-calculator/images/icons/iconR.ico',
          
        },
        fileAssociations: {
            ext: 'ico',
            icon: './images/icons/iconR.ico'
          }
        
      }
      
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
