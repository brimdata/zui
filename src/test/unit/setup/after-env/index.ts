import "regenerator-runtime/runtime"
import {configure} from "@testing-library/react"
import env from "src/app/core/env"
import {ipcRenderer} from "electron"

const preloadApi = () => ({
  on: ipcRenderer.on.bind(ipcRenderer),
  off: ipcRenderer.off.bind(ipcRenderer),
  once: ipcRenderer.once.bind(ipcRenderer),
  invoke: ipcRenderer.invoke.bind(ipcRenderer),
})

global.zui = preloadApi()

if (env.isCI) {
  configure({asyncUtilTimeout: 5000})
}
