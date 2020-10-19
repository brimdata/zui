import {BrowserWindow, ipcMain, screen} from "electron"

import {NewTabSearchParams} from "../ipc/windows/messages"
import {SessionState} from "./formatSessionState"
import {WindowParams} from "./window"
import {isBoolean} from "../../lib/is"
import brim from "../../brim"
import ipc from "../ipc"
import sendTo from "../ipc/sendTo"
import tron from "./"
import {stack} from "../window/dimens"
import {last} from "lodash"

export type WindowName = "search" | "about" | "detail"
export type $WindowManager = ReturnType<typeof windowManager>

export type WindowsState = {
  [key: string]: WindowState
}

export type WindowState = {
  ref: BrowserWindow
  name: string
  size?: [number, number]
  position?: [number, number]
  state?: Object
  lastFocused: number
}

export default function windowManager() {
  let windows: WindowsState = {}
  let isQuitting = false

  return {
    init(session?: SessionState | null | undefined) {
      if (!session || (session && session.order.length === 0)) {
        this.openWindow("search")
      } else {
        for (const id of session.order) {
          const {name, size, position, state} = session.windows[id]
          this.openWindow(name, {size, position, id})
          this.updateWindow(id, {state})
        }
      }
    },

    isQuitting(val?: boolean | null | undefined) {
      if (isBoolean(val)) isQuitting = val
      else return isQuitting
    },

    getState(): WindowsState {
      const state = {}
      for (const id in windows) {
        const win = windows[id]
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
            const win = windows[id]
            const channel = brim.randomHash()
            const timeout = setTimeout(() => resolve([id, undefined]), 5000)

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
      return Object.values(windows).sort(
        (a, b) => a.lastFocused - b.lastFocused
      )
    },

    count(): number {
      return Object.keys(windows).length
    },

    updateWindow(id: string, data: Partial<WindowState>) {
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

    openWindow(name: WindowName, winParams: Partial<WindowParams> = {}) {
      const lastWin = last<WindowState>(this.getWindows())

      const params = defaultWindowParams(winParams, lastWin && lastWin.ref)
      const id = params.id

      const ref = tron
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
      const about = this.getWindows().find((w) => w.name === "about")
      if (about) {
        about.ref.focus()
      } else {
        this.openWindow("about")
      }
    },

    openPreferences() {
      const win = this.getWindows()
        .sort((a, b) => (b.lastFocused || 0) - (a.lastFocused || 0))
        .find((w) => w.name === "search")

      if (win) {
        win.ref.webContents.send("showPreferences")
      } else {
        const {win} = this.openWindow("search", {})

        win.ref.webContents.once("did-finish-load", () => {
          win.ref.webContents.send("showPreferences")
        })
      }
    },

    closeWindow() {
      const win = BrowserWindow.getFocusedWindow()
      if (win) win.close()
    },

    destroyWindow(win: BrowserWindow) {
      if (win) win.destroy()
    },

    moveToCurrentDisplay() {
      const point = screen.getCursorScreenPoint()
      const bounds = screen.getDisplayNearestPoint(point).workArea
      const {x, y} = bounds

      let prev = [x, y]
      this.getWindows().forEach(({ref: win}: WindowState) => {
        const [width, height] = win.getSize()
        const [x, y] = prev
        const next = stack({x, y, width, height}, bounds, 25)
        win.setBounds(next)
        prev = [next.x, next.y]
      })
    }
  }
}

function defaultWindowParams(
  params: Partial<WindowParams>,
  lastWin?: BrowserWindow
): WindowParams {
  let {position, size} = params
  if (lastWin && !position && !size) {
    const prev = lastWin.getBounds()
    const bounds = screen.getDisplayNearestPoint({x: prev.x, y: prev.y})
    const dimens = stack(prev, bounds.workArea, 25)
    position = [dimens.x, dimens.y]
    size = [dimens.width, dimens.height]
  }

  return {
    size,
    position,
    id: brim.randomHash(),
    query: {},
    ...params
  }
}
