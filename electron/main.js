const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { LicenseManager } = require('../src/utils/licenseManager');
const { localDb } = require('../src/utils/localDatabase');

let mainWindow;

// ... (keep existing createWindow and app event listeners)

// License validation logic
ipcMain.handle('check-license', async () => {
  const user = await localDb.findOne('users', {});
  if (user && user.licenseKey) {
    const isValid = await LicenseManager.validateLicenseKey(user.licenseKey, user._id);
    return { isValid, message: isValid ? 'Licensed version' : 'Invalid license' };
  } else if (user && !user.isTrialExpired) {
    return { isValid: true, message: 'Trial version' };
  } else {
    return { isValid: false, message: 'Trial expired' };
  }
});

ipcMain.handle('activate-license', async (event, inputLicenseKey) => {
  const user = await localDb.findOne('users', {});
  if (user) {
    const isValid = await LicenseManager.validateLicenseKey(inputLicenseKey, user._id);
    if (isValid) {
      await localDb.update('users', { _id: user._id }, { licenseKey: inputLicenseKey, isTrialExpired: false });
      return { success: true, message: 'License activated successfully' };
    }
  }
  return { success: false, message: 'Invalid license key' };
});