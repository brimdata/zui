/* @flow */

import {BrowserWindow} from "electron"

import type {ReturnType} from "../../types"
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

    openWindow(name: string, params: Object) {
      let ref = tron.window(name, params, state)
      windows[ref.id] = {ref, name}
    },

    closeWindow() {
      let win = BrowserWindow.getFocusedWindow()
      if (win) win.close()
    }
  }
}
