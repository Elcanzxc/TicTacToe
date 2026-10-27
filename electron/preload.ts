import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  onMaximizeChange: (callback: (isMax: boolean) => void) => () => void;
}

const api: ElectronAPI = {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onMaximizeChange: (callback: (isMax: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, isMax: boolean) => callback(isMax);
    ipcRenderer.on('window-maximize-changed', handler);
    return () => {
      ipcRenderer.removeListener('window-maximize-changed', handler);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

