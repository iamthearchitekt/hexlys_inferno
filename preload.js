const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveLevel: (data) => ipcRenderer.invoke('save-level-data', data)
});
