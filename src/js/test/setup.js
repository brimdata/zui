/* @flow */
const enzyme = require("enzyme")
const Adapter = require("enzyme-adapter-react-16")

jest.mock("electron", function() {
  return {app: {isPackaged: true}}
})

enzyme.configure({adapter: new Adapter()})
