import "regenerator-runtime/runtime"
import {configure} from "@testing-library/react"
import env from "src/core/env"
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

// @ts-ignore Quiets electron-updater during tests on Linux (see https://github.com/brimdata/zui/pull/3097)
process.resourcesPath = "DoesNotExist"
