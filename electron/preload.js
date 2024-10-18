const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  checkLicense: () => ipcRenderer.invoke('check-license'),
  activateLicense: (licenseKey) => ipcRenderer.invoke('activate-license', licenseKey),
});