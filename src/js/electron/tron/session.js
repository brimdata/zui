/* @flow */

import {app} from "electron"
import path from "path"

import type {GlobalState} from "../../state/globalReducer"
import type {WindowsState, WindowState} from "./windowManager"
import lib from "../../lib"

const SESSION_STATE_FILE = path.join(app.getPath("userData"), "appState.json")

export type SessionState = {|
  order: string[],
  windows: {
    [string]: {
      name: string,
      position: [number, number],
      size: [number, number],
      state: Object
    }
  },
  globalState: GlobalState
|}

export default function session() {
  return {
    save(windows: WindowsState, globalState: GlobalState) {
      let groupById = (all, id) => ({
        ...all,
        [id]: getWindowData(windows[id])
      })
      let order = getWindowOrder(windows)
      let fileContents = JSON.stringify(
        ({
          order,
          windows: order.reduce(groupById, {}),
          globalState
        }: SessionState)
      )
      lib.file(SESSION_STATE_FILE).write(fileContents)
    },

    load(): ?SessionState {
      let contents

      try {
        contents = lib.file(SESSION_STATE_FILE).readSync()
      } catch {
        return undefined
      }

      try {
        return JSON.parse(contents)
      } catch (e) {
        console.error("Unable to load session state")
        console.error(e)
        return undefined
      }
    }
  }
}

function getWindowOrder(windows: WindowsState): string[] {
  return (
    Object.entries(windows)
      // $FlowFixMe
      .sort((a, b) => a[1].lastFocused - b[1].lastFocused)
      .map((e) => e[0])
  )
}

function getWindowData({name, state, size, position}: WindowState) {
  return {name, state, size, position}
}
