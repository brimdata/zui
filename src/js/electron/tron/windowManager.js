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
      this.openWindow("welcome")
    },

    openWindow(name: WindowName, params: Object) {
      let manager = this
      let ref = tron
        .window(name, params, state)
        .on("focus", (e) => menu.setMenu(name, e.sender, manager))
      windows[ref.id] = {ref, name}
    },

    closeWindow() {
      let win = BrowserWindow.getFocusedWindow()
      if (win) win.close()
    }
  }
}
