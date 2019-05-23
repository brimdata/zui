/* @flow */
const Adapter = require("enzyme-adapter-react-16")
const enzyme = require("enzyme")

jest.mock("electron", function() {
  let electron = {
    app: {
      isPackaged: true,
      getName: () => "TestApp"
    },
    getCurrentWebContents: jest.fn(() => ({
      send: jest.fn()
    })),
    Menu: {
      buildFromTemplate: jest.fn(),
      setApplicationMenu: jest.fn()
    }
  }

  return {...electron, remote: electron}
})

enzyme.configure({adapter: new Adapter()})
