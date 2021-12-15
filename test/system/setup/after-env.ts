import "@testing-library/jest-dom"
import {configure} from "@testing-library/react"
import log from "electron-log"
import "regenerator-runtime/runtime"
import "web-streams-polyfill"

global.DOMRectReadOnly = class DOMRectReadOnly {}
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.SVGElement.prototype.getTotalLength = () => 0
document.execCommand = jest.fn()

configure({asyncUtilTimeout: 5000})

HTMLElement.prototype.scrollTo = () => {}

// process.on("unhandledRejection", (reason) => {
// throw reason
// })

log.transports.console.level = false
