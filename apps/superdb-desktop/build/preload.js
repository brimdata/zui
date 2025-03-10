const {contextBridge, ipcRenderer} = require("electron")

const preloadApi = () => ({
  on: (channel, handler) => {
    ipcRenderer.on(channel, handler)
    return () => {
      ipcRenderer.off(channel, handler)
    }
  },
  once: ipcRenderer.once.bind(ipcRenderer),
  invoke: ipcRenderer.invoke.bind(ipcRenderer),
})

contextBridge.exposeInMainWorld("zui", preloadApi())
