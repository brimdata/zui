const {contextBridge, ipcRenderer} = require("electron")

const preloadApi = () => ({
  on: ipcRenderer.on.bind(ipcRenderer),
  off: ipcRenderer.off.bind(ipcRenderer),
  once: ipcRenderer.once.bind(ipcRenderer),
  invoke: ipcRenderer.invoke.bind(ipcRenderer),
})

contextBridge.exposeInMainWorld("zui", preloadApi())
