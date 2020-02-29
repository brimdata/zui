/* @flow */

import {BrowserWindow} from "electron"

import type {ReturnType} from "../../types"
import type {WindowParams} from "./window"
import brim from "../../brim"
import menu from "../menu"
import tron from "./"

export type WindowName = "welcome" | "search" | "login"
export type $WindowManager = ReturnType<typeof windowManager>

type WindowState = {
  size?: [number, number],
  position?: [number, number],
  state?: Object,
  lastFocused?: number
}

export type AppState = {
  order: string[],
  states: {
    size: [number, number],
    position: [number, number],
    state: Object
  }
}

export default function windowManager() {
  let windows = {}
  let appState: AppState = {}
  let isQuitting = false

  return {
    init(state: ?AppState) {
      if (state) {
        for (let id of state.order) {
          let {size, position} = state.states[id]
          this.openWindow("search", {size, position, query: {id}})
        }
      } else {
        this.openWindow("search")
      }
    },

    isQuitting() {
      isQuitting = true
    },

    getState() {
      let order = getWindowOrder(windows)
      let states = order.reduce(
        (obj, id) => ({
          ...obj,
          [id]: appState[id]
        }),
        {}
      )
      return {
        order,
        states
      }
    },

    setState(id: string, data: WindowState) {
      let prev = appState[id]
      appState = {
        ...appState,
        [id]: {...prev, ...data}
      }
    },

    getInitialState(id: string) {
      return "Data for: " + id
    },

    openWindow(name: WindowName, winParams: $Shape<WindowParams> = {}) {
      let manager = this
      let params = defaultWindowParams(winParams)
      let id = params.id

      let ref = tron
        .window(name, params)
        .on("focus", () => {
          windows[id].lastFocused = new Date().getTime()
          menu.setMenu(name, manager)
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

function getWindowOrder(windows): string[] {
  return (
    Object.entries(windows)
      // $FlowFixMe
      .sort((a, b) => a[1].lastFocused - b[1].lastFocused)
      .map((e) => e[0])
  )
}
