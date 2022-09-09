import {nanoid} from "@reduxjs/toolkit"
import {isObject} from "lodash"
import {
  getPersistedGlobalState,
  getPersistedWindowState,
} from "src/js/state/stores/get-persistable"
import {State} from "src/js/state/types"
import {SerializedWindow} from "./windows/types"

export type SessionState = {
  order: string[]
  windows: {
    [id: string]: SerializedWindow
  }
  globalState: any
}

function getWindowOrder(windows: SerializedWindow[]): string[] {
  return windows.map((e) => e.id)
}

function getWindowData({name, state, size, position}: SerializedWindow) {
  return {name, state, size, position}
}

export function encodeSessionState(
  windows: SerializedWindow[],
  globalState: State
): SessionState {
  const groupById = (all, window) => ({
    ...all,
    [window.id]: getWindowData(window),
  })

  const order = getWindowOrder(windows)

  return {
    order,
    windows: windows.reduce(groupById, {}),
    globalState,
  }
}

function decodeSessionWindows(windows: unknown) {
  if (!windows) return {}
  if (!isObject(windows)) return {}
  let object = {}
  for (let id in windows) {
    const data = windows[id]
    const window: SerializedWindow = {
      id: data["id"] ?? nanoid(),
      name: data["name"] ?? "search",
      position: data["position"] ?? [25, 25],
      size: data["size"] ?? [500, 500],
      lastFocused: data["lastFocused"] ?? 0,
      state: getPersistedWindowState(data["state"]),
    }
    object[id] = window
  }
  return object
}

export function decodeSessionState(data: unknown): SessionState {
  if (!data) return null
  if (!isObject(data)) return null
  return {
    globalState: getPersistedGlobalState(data["globalState"]),
    order: data["order"] ?? [],
    windows: decodeSessionWindows(data["windows"]),
  }
}
