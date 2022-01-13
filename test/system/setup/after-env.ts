import "regenerator-runtime/runtime"
import "@testing-library/jest-dom"
import {configure} from "@testing-library/react"
import env from "app/core/env"
import log from "electron-log"

import "web-streams-polyfill"

// @ts-ignore
global.DOMRectReadOnly = class DOMRectReadOnly {}
// @ts-ignore
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.SVGElement.prototype.getTotalLength = () => 0
document.execCommand = jest.fn()

configure({asyncUtilTimeout: env.isCI ? 20_000 : 1000})

HTMLElement.prototype.scrollTo = () => {}

log.transports.console.level = false
