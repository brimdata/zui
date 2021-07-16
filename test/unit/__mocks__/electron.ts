import {join} from "path"
import createIPCMock from "electron-mock-ipc"
import EventEmitter from "events"

const mockIpc = createIPCMock()
export const ipcMain = mockIpc.ipcMain
export const ipcRenderer = mockIpc.ipcRenderer

class WebContents extends EventEmitter {
  send(channel, ...args) {
    ipcRenderer.emitter.emit("receive-from-main", channel, ...args)
  }
}
export class BrowserWindow {
  webContents = new WebContents()
  isDestroyed = jest.fn(() => false)
  focus = jest.fn()
  center() {}
  setMenu() {}
  on() {
    return this
  }
  loadFile() {}
  setSize() {}
  getSize() {
    return [100, 100]
  }
  getPosition() {
    return [0, 0]
  }
  destroy() {}
}

class MockApp {
  isPackaged = true
  quit = jest.fn()
  relaunch = jest.fn()
  disableHardwareAcceleration = jest.fn()
  requestSingleInstanceLock = jest.fn()
  setAsDefaultProtocolClient = jest.fn()
  on = jest.fn()
  whenReady = jest.fn(() => Promise.resolve())

  getName() {
    return "TestApp"
  }
  getPath() {
    return join(__dirname, "../../../run/unit/data")
  }
  setPath() {}
  getVersion() {
    return "0.0.0"
  }
  getAppPath() {
    return join(__dirname, "../../../")
  }
}

export const app = new MockApp()

export const getCurrentWebContents = jest.fn(() => ({
  send: jest.fn()
}))

export const Menu = {
  buildFromTemplate: jest.fn(),
  setApplicationMenu: jest.fn()
}

export const screen = {
  getAllDisplays() {
    return [
      {
        id: 459098087,
        bounds: {x: 0, y: 0, width: 1920, height: 1080},
        workArea: {x: 0, y: 23, width: 1920, height: 1057},
        accelerometerSupport: "unknown",
        monochrome: false,
        colorDepth: 24,
        colorSpace:
          "{primaries_d50_referred: [[0.6825, 0.3155],  [0.3001, 0.6589],  [0.1589, 0.0529]], transfer:BT709_APPLE, matrix:RGB, range:FULL}",
        depthPerComponent: 8,
        size: {width: 1920, height: 1080},
        workAreaSize: {width: 1920, height: 1057},
        scaleFactor: 2,
        rotation: 0,
        internal: false,
        touchSupport: "unknown"
      }
    ]
  }
}

export const autoUpdater = {
  on: jest.fn()
}

export const remote = {app}
