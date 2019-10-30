/* @flow */
// $FlowFixMe
require("regenerator-runtime/runtime")
const Adapter = require("enzyme-adapter-react-16")
const enzyme = require("enzyme")

jest.mock("electron", function() {
  class FakeBrowserWindow {
    center() {}
    setMenu() {}
    on() {}
    loadFile() {}
  }

  let electron = {
    app: {
      isPackaged: true,
      getName: () => "TestApp",
      getPath: () => "/fake/path"
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
      on: jest.fn()
    },
    ipcRenderer: {
      on: jest.fn()
    }
  }

  return {...electron, remote: electron}
})

enzyme.configure({adapter: new Adapter()})
