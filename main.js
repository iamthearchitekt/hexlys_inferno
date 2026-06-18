const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// ── GPU crash / cache lock prevention ────────────────────────────────────────
// Disables the on-disk GPU shader cache so a crashed process can't leave a
// lock on GPUCache/ in AppData, which would cause every subsequent launch to
// crash with "Access is denied".
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
// Also guard against the GPU process itself dying on unusual hardware configs.
app.commandLine.appendSwitch('disable-gpu-process-crash-limit');

let mainWindow = null;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, 'hexly_icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Disable webSecurity strictly for this local window so audiosynth.js
      // can fetch local .wav files natively via file:// 
      webSecurity: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ── Renderer crash handler ────────────────────────────────────────────────────
// If the renderer process dies (JS exception, OOM, GPU driver failure) force
// a clean app exit so no orphan processes hold locks on GPUCache/.
app.on('render-process-gone', (event, webContents, details) => {
  console.error('[Main] Renderer process gone:', details.reason, details.exitCode);
  // Give Electron a moment to log the crash, then exit cleanly.
  setTimeout(() => app.exit(1), 500);
});

// ── Child-process (GPU / utility) crash handler ───────────────────────────────
app.on('child-process-gone', (event, details) => {
  if (details.type === 'GPU' || details.type === 'renderer') {
    console.error('[Main] Child process gone:', details.type, details.reason);
    setTimeout(() => app.exit(1), 500);
  }
});

// ── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC: save level data from the Dev Editor ─────────────────────────────────
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
