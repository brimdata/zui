import createIPCMock from "electron-mock-ipc"
import EventEmitter from "events"
import path from "path"
const mockIpc = createIPCMock()

export const ipcMain = mockIpc.ipcMain
export const ipcRenderer = mockIpc.ipcRenderer

export const dialog = {
  showSaveDialog: jest.fn(),
}

class WebContents extends EventEmitter {
  send(channel, ...args) {
    ipcRenderer.emitter.emit("receive-from-main", channel, ...args)
  }
}
export class BrowserWindow {
  static getAllWindows = jest.fn(() => [])
  static fromWebContents() {
    return new BrowserWindow()
  }
  webContents = new WebContents()
  isDestroyed = jest.fn(() => false)
  focus = jest.fn()
  visible = true
  getBounds() {
    return {x: 0, y: 0}
  }
  center() {}
  setMenu() {}
  on() {
    return this
  }
  loadURL(_url: string) {}
  loadFile(_name: string, _params: any) {}
  setSize() {}
  getSize() {
    return [100, 100]
  }
  getPosition() {
    return [0, 0]
  }
  destroy() {}
  hide() {
    this.visible = false
  }
  show() {
    this.visible = true
  }
  isVisible() {
    return this.visible
  }
}

class MockApp extends EventEmitter {
  isPackaged = true
  quit = jest.fn()
  relaunch = jest.fn()
  disableHardwareAcceleration = jest.fn()
  requestSingleInstanceLock = jest.fn()
  setAsDefaultProtocolClient = jest.fn()
  whenReady = jest.fn(() => Promise.resolve())

  commandLine = {
    getSwitchValue() {
      return ""
    },
    hasSwitch() {
      return false
    },
  }

  getName() {
    return "TestApp"
  }
  getPath(name) {
    return path.join(this.getAppPath(), "run", name)
  }
  setPath() {}
  getVersion() {
    return "0.0.0"
  }
  getAppPath() {
    return path.join(__dirname, "../../../../")
  }
  exit(_n: number) {
    return
  }
  exit() {
    return
  }
}

export const app = new MockApp()

export const getCurrentWebContents = jest.fn(() => ({
  send: jest.fn(),
}))

export const Menu = {
  buildFromTemplate: jest.fn(),
  setApplicationMenu: jest.fn(),
}

const display = {
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
  touchSupport: "unknown",
}

export const screen = {
  getDisplayNearestPoint() {
    return display
  },
  getAllDisplays() {
    return [display]
  },
}

export const autoUpdater = {
  on: jest.fn(),
}

export const shell = {
  openExternal: jest.fn(),
}

export const contextBridge = {
  exposeInMainWorld: jest.fn(),
}

export const protocol = {
  interceptFileProtocol: jest.fn(),
}
