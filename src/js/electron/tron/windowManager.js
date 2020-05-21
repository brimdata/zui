/* @flow */

import {BrowserWindow, ipcMain} from "electron"

import type {NewTabSearchParams} from "../ipc/windows/messages"
import type {ReturnType} from "../../types"
import type {SessionState} from "./formatSessionState"
import type {WindowParams} from "./window"
import {isBoolean} from "../../lib/is"
import brim from "../../brim"
import ipc from "../ipc"
import sendTo from "../ipc/sendTo"
import tron from "./"

export type WindowName = "search" | "about" | "detail"
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

    isQuitting(val: ?boolean) {
      if (isBoolean(val)) isQuitting = val
      else return isQuitting
    },

    getState(): WindowsState {
      let state = {}
      for (let id in windows) {
        let win = windows[id]
        if (win.name === "search") {
          state[id] = win
        }
      }
      return state
    },

    fetchWindowStates() {
      return Promise.all(
        Object.keys(windows).map((id) => {
          return new Promise((resolve) => {
            let win = windows[id]
            let channel = brim.randomHash()
            let timeout = setTimeout(() => resolve([id, undefined]), 5000)

            ipcMain.once(channel, (event, state) => {
              clearTimeout(timeout)
              this.updateWindow(id, {state})
              resolve([id, state])
            })

            win.ref.webContents.send("getState", channel)
          })
        })
      )
    },

    getWindows(): WindowState[] {
      // $FlowFixMe
      return Object.values(windows)
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

    openSearchTab(searchParams: NewTabSearchParams) {
      let isNewWin = true
      const existingWin = this.getWindows()
        .sort((a, b) => a.lastFocused - b.lastFocused)
        .find((w) => w.name === "search")
      if (existingWin) {
        isNewWin = false
        sendTo(
          existingWin.ref.webContents,
          ipc.windows.newSearchTab({...searchParams, isNewWin})
        )
        existingWin.ref.focus()
        return
      }

      const {win} = this.openWindow("search", {})
      win.ref.webContents.once("did-finish-load", () => {
        sendTo(
          win.ref.webContents,
          ipc.windows.newSearchTab({...searchParams, isNewWin})
        )
      })
    },

    openWindow(name: WindowName, winParams: $Shape<WindowParams> = {}) {
      let params = defaultWindowParams(winParams)
      let id = params.id

      let ref = tron
        .window(name, params)
        .on("focus", () => {
          if (!isQuitting) windows[id].lastFocused = new Date().getTime()
        })
        .on("closed", () => {
          if (!isQuitting) delete windows[id]
        })

      const win = {ref, name, lastFocused: new Date().getTime()}
      windows[id] = win

      return {id, win}
    },

    openAbout() {
      let about = this.getWindows().find((w) => w.name === "about")
      if (about) {
        about.ref.focus()
      } else {
        this.openWindow("about")
      }
    },

    openPreferences() {
      let win = this.getWindows()
        .sort((a, b) => (b.lastFocused || 0) - (a.lastFocused || 0))
        .find((w) => w.name === "search")

      if (win) {
        win.ref.webContents.send("showPreferences")
      } else {
        let {win} = this.openWindow("search", {})

        win.ref.webContents.once("did-finish-load", () => {
          win.ref.webContents.send("showPreferences")
        })
      }
    },

    closeWindow() {
      let win = BrowserWindow.getFocusedWindow()
      if (win) win.close()
    },

    destroyWindow(win: BrowserWindow) {
      if (win) win.destroy()
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
