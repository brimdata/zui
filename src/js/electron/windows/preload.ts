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
  invoke: (...args) => {
    cloneCheck(args)
    return ipcRenderer.invoke.bind(ipcRenderer)(...args)
  },
  windowId: getWindowId(),
  windowName: getWindowName(),
  env: {
    isMac: process.platform === "darwin",
    isTest: process.env.NODE_ENV === "test",
  },
}

function cloneCheck(value: any) {
  try {
    window.postMessage(value, "*")
  } catch (e) {
    console.log("Could not clone", value)
    throw new Error("Can not clone object")
  }
}

export type PreloadApi = typeof preloadApi

contextBridge.exposeInMainWorld("zui", preloadApi)
