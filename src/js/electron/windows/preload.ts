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
  listen: (message: string, callback: any) => ipcRenderer.on(message, callback),
  windowId: getWindowId(),
  windowName: getWindowName(),
  invoke: ipcRenderer.invoke,
  env: {
    isTest: process.env.NODE_ENV === "test",
  },
}

export type PreloadApi = typeof preloadApi

contextBridge.exposeInMainWorld("zui", preloadApi)
