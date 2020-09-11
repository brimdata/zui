require("regenerator-runtime/runtime")

import initDOM from "../initializers/initDOM"

const Adapter = require("enzyme-adapter-react-16")
const enzyme = require("enzyme")

jest.mock("electron", function() {
  class FakeBrowserWindow {
    webContents: {send: any}
    constructor() {
      this.webContents = {send: jest.fn()}
    }
    center() {}
    setMenu() {}
    on() {
      return this
    }
    loadFile() {}
    setSize() {}
  }

  const electron = {
    app: {
      isPackaged: true,
      getName: () => "TestApp",
      getPath: () => "/fake/path",
      getVersion: () => "test-version",
      getAppPath: () => "fake/app/path"
    },
    getCurrentWebContents: jest.fn(() => ({
      send: jest.fn()
    })),
    Menu: {
      buildFromTemplate: jest.fn(),
      setApplicationMenu: jest.fn()
    },
    BrowserWindow: FakeBrowserWindow,
    ipcMain: {
      on: jest.fn(),
      once: jest.fn()
    },
    ipcRenderer: {
      send: jest.fn(),
      on: jest.fn(),
      invoke: () => Promise.resolve()
    }
  }

  return {...electron, remote: electron}
})

global.DOMRectReadOnly = class DOMRectReadOnly {}
global.ResizeObserver = class ResizeObserver {
  observe() {}
  disconnect() {}
}
global.SVGElement.prototype.getTotalLength = () => 0
enzyme.configure({adapter: new Adapter()})

document.execCommand = jest.fn()
initDOM()
