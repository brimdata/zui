/* @flow */

import {app} from "electron"
import path from "path"

import type {Keep} from "../lib/keep"
import type {WindowName} from "../lib/window"
import lib from "../lib"

type WindowState = {
  [WindowName]: {
    size: [number, number],
    position: [number, number] | "center"
  }
}

export default function windowState(): Keep {
  let file = path.join(app.getPath("userData"), "windowState.json")
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
  return lib.keep<WindowState>(file, initialState)
}
