import {app, ipcMain, ipcRenderer} from "electron"
import {session} from "src/zui"

export function teardown() {
  app.removeAllListeners()
  teardownMockIpc(ipcRenderer)
  teardownMockIpc(ipcMain)
  teardownPluginApi()
}

function teardownMockIpc(ipc: typeof ipcRenderer | typeof ipcMain) {
  ipc
    .eventNames()
    .filter(
      (name: string) =>
        !name.startsWith("__electron_mock_ipc__") &&
        ![
          "receive-from-main",
          "error-from-main",
          "send-to-main",
          "receive-from-renderer",
          "error-from-renderer",
          "send-to-renderer",
        ].includes(name)
    )
    .forEach((name: string) => ipc.removeAllListeners(name))
}

function teardownPluginApi() {
  session._teardown()
}
