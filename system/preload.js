const {
  contextBridge,
  ipcRenderer,
  shell
} = require('electron');
const config = require('./config');
const Store = require('electron-store');

const store = new Store();

// IpcRenderer (Inter-Process Communication)
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  sendSync: (channel, data) => ipcRenderer.sendSync(channel, data),
  on: (channel, func) =>
      ipcRenderer.on(channel, (event, ...args) => func(...args)),
  removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// Get Config
contextBridge.exposeInMainWorld('config', config);

// Get saved config
contextBridge.exposeInMainWorld('store', {
  get: (key) => store.get(key),
  set: (key, value) => store.set(key, value),
  delete: (key) => store.delete(key),
  clear: () => store.clear(),
});

// Open Link
contextBridge.exposeInMainWorld('openLink', (url) => {
  shell.openExternal(url);
});