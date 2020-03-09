/* @flow */

import {BrowserWindow} from "electron"

import type {ReturnType} from "../../types"
import type {SessionState} from "./session"
import type {WindowParams} from "./window"
import brim from "../../brim"
import menu from "../menu"
import tron from "./"

export type WindowName = "search"
export type $WindowManager = ReturnType<typeof windowManager>

export type WindowsState = {[string]: WindowState}

export type WindowState = {|
  ref: BrowserWindow,
  name: string,
  size?: [number, number],
  position?: [number, number],
  state?: Object,
  lastFocused?: number
|}

export default function windowManager() {
  let windows: WindowsState = {}
  let isQuitting = false

  return {
    init(session: ?SessionState) {
      if (!session || (session && session.order.length === 0))
        return this.openWindow("search")
      for (let id of session.order) {
        let {name, size, position, state} = session.windows[id]
        this.openWindow(name, {size, position, id})
        this.updateWindow(id, {state})
      }
    },

    isQuitting() {
      isQuitting = true
    },

    getWindows(): WindowsState {
      return windows
    },

    count(): number {
      return Object.keys(windows).length
    },

    updateWindow(id: string, data: $Shape<WindowState>) {
      windows = {
        ...windows,
        [id]: {...windows[id], ...data}
      }
    },

    getWindow(id: string): WindowState {
      return windows[id]
    },

    openWindow(name: WindowName, winParams: $Shape<WindowParams> = {}) {
      let manager = this
      let params = defaultWindowParams(winParams)
      let id = params.id

      let ref = tron
        .window(name, params)
        .on("focus", () => {
          if (!isQuitting) {
            windows[id].lastFocused = new Date().getTime()
            menu.setMenu(name, manager)
          }
        })
        .on("closed", () => {
          if (!isQuitting) {
            delete windows[id]
          }
        })
      windows[id] = {ref, name, lastFocused: new Date().getTime()}
    },

    closeWindow() {
      let win = BrowserWindow.getFocusedWindow()
      if (win) win.close()
    }
  }
}

function defaultWindowParams(params: $Shape<WindowParams>): WindowParams {
  return {
    size: [1000, 800],
    id: brim.randomHash(),
    query: {},
    ...params
  }
}
