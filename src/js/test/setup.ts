require("regenerator-runtime/runtime")

import {meta} from "app/ipc/meta"
import {serve} from "src/pkg/electron-ipc-service"
import initDOM from "../initializers/initDOM"

const Adapter = require("enzyme-adapter-react-16")
const enzyme = require("enzyme")

global.DOMRectReadOnly = class DOMRectReadOnly {}
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.SVGElement.prototype.getTotalLength = () => 0
enzyme.configure({adapter: new Adapter()})
document.execCommand = jest.fn()
initDOM()
global.fetch = require("node-fetch")

serve(meta)
