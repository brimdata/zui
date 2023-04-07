import {contextBridge, ipcRenderer} from "electron"

const getWindowId = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get("id")
}

const getWindowName = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get("name")
}

const preloadApi = {
  listen: ipcRenderer.on.bind(ipcRenderer),
  listenOnce: ipcRenderer.once.bind(ipcRenderer),
  stopListen: ipcRenderer.off.bind(ipcRenderer),
  invoke: ipcRenderer.invoke.bind(ipcRenderer),
  windowId: getWindowId(),
  windowName: getWindowName(),
  env: {
    isMac: process.platform === "darwin",
    isTest: process.env.NODE_ENV === "test",
  },
}

export type PreloadApi = typeof preloadApi

contextBridge.exposeInMainWorld("zui", preloadApi)
