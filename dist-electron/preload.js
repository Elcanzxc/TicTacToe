"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const api = {
    minimize: () => electron_1.ipcRenderer.send('window-minimize'),
    maximize: () => electron_1.ipcRenderer.send('window-maximize'),
    close: () => electron_1.ipcRenderer.send('window-close'),
    isMaximized: () => electron_1.ipcRenderer.invoke('window-is-maximized'),
    onMaximizeChange: (callback) => {
        const handler = (_event, isMax) => callback(isMax);
        electron_1.ipcRenderer.on('window-maximize-changed', handler);
        return () => {
            electron_1.ipcRenderer.removeListener('window-maximize-changed', handler);
        };
    },
};
electron_1.contextBridge.exposeInMainWorld('electronAPI', api);
