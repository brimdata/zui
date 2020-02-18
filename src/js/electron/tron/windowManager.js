/* @flow */

import {BrowserWindow} from "electron"

import type {ReturnType} from "../../types"
import menu from "../menu"
import tron from "./"

export type WindowName = "welcome" | "search" | "login"
export type $WindowManager = ReturnType<typeof windowManager>

export default function windowManager() {
  let state = tron.windowState()
  let windows = {}

  return {
    init() {
      state.load()
      this.openWindow("search")
    },

    openWindow(name: WindowName, params: Object, query: Object) {
      let win = BrowserWindow.getFocusedWindow()
      if (win && windows[win.id].name === name) {
        let [x, y] = win.getPosition()
        x += 20
        y += 20
        params = {...params, x, y}
      }
      let manager = this
      let ref = tron
        .window(name, params, query, state)
        .on("focus", () => menu.setMenu(name, manager))
      windows[ref.id] = {ref, name}
    },

    closeWindow() {
      let win = BrowserWindow.getFocusedWindow()
      if (win) win.close()
    }
  }
}
