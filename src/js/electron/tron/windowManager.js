/* @flow */

import {BrowserWindow} from "electron"

import tron, {type $WindowManager} from "./"

export type WindowName = "welcome" | "search" | "login"

export default function windowManager(): $WindowManager {
  let state = tron.windowState()
  let windows = {}

  return {
    init() {
      state.load()
      this.openWindow("welcome")
    },

    openWindow(name: string) {
      let ref = tron.window(name, {}, state)
      windows[ref.id] = {ref, name}
    },

    closeWindow() {
      let win = BrowserWindow.getFocusedWindow()
      if (win) win.close()
    }
  }
}
