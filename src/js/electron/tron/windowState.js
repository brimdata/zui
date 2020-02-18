/* @flow */

import type {Keep} from "../../lib/keep"
import config from "../config"
import lib from "../../lib"

type WindowName = "welcome" | "login" | "search" | "blank"
type WindowData = {
  [WindowName]: {
    size: [number, number],
    position: [number, number] | "center"
  }
}
export type WindowKeep = Keep<WindowData>

export default function windowState(): WindowKeep {
  let initialState = {
    login: {
      size: [630, 460],
      position: "center"
    },
    search: {
      size: [1000, 800],
      position: "center"
    },
    welcome: {
      size: [600, 400],
      position: "center"
    },
    blank: {
      size: [1000, 800],
      position: "center"
    }
  }
  return lib.keep<WindowData>(config.windowStateFile(), initialState)
}
