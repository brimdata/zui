import "regenerator-runtime/runtime"
import "@testing-library/jest-dom"
import "web-streams-polyfill/es2018"
import {configure} from "@testing-library/react"
import env from "app/core/env"
import log from "electron-log"

global.DOMRectReadOnly = class DOMRectReadOnly {}
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.SVGElement.prototype.getTotalLength = () => 0
document.execCommand = jest.fn()

if (env.isCI) {
  configure({asyncUtilTimeout: 5000})
}

HTMLElement.prototype.scrollTo = () => {}

process.on("unhandledRejection", (reason) => {
  throw reason
})

log.transports.console.level = false
