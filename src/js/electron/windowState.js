/* @flow */

import type {Keep} from "../lib/keep"
import type {WindowName} from "./browserWindow"
import config from "./config"
import lib from "../lib"

type WindowState = {
  [WindowName]: {
    size: [number, number],
    position: [number, number] | "center"
  }
}

export default function windowState(): Keep {
  let initialState = {
    login: {
      size: [630, 460],
      position: "center"
    },
    search: {
      size: [1000, 800],
      position: "center"
    }
  }
  return lib.keep<WindowState>(config.windowStateFile, initialState)
}
