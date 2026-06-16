const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, 'hexly_icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Disable webSecurity strictly for this local window so audiosynth.js can fetch local .wav files natively
      webSecurity: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handler for saving level data natively from the Dev Editor
ipcMain.handle('save-level-data', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Level Layout',
      defaultPath: path.join(__dirname, 'level_saves', 'level_export.json'),
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (filePath) {
      fs.writeFileSync(filePath, data);
      return { success: true, path: filePath };
    }
    return { success: false, canceled: true };
  } catch (err) {
    console.error('Failed to save file:', err);
    return { success: false, error: err.message };
  }
});
