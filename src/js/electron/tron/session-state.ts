import {getPersistedState} from "src/js/state/getPersistable"
import {GlobalState} from "../../state/globalReducer"
import {SerializedWindow, WindowName} from "./window-manager"

export type SessionState = {
  order: string[]
  windows: {
    [id: string]: {
      name: WindowName
      position: [number, number]
      size: [number, number]
      state: Object
    }
  }
  globalState: GlobalState
}

function getWindowOrder(windows: SerializedWindow[]): string[] {
  return windows.map((e) => e.id)
}

function getWindowData({name, state, size, position}: SerializedWindow) {
  return {name, state, size, position}
}

export function encodeSessionState(
  windows: SerializedWindow[],
  globalState: GlobalState
): SessionState {
  const groupById = (all, window) => ({
    ...all,
    [window.id]: getWindowData(window)
  })

  const order = getWindowOrder(windows)

  return {
    order,
    windows: windows.reduce(groupById, {}),
    globalState
  }
}

export function decodeSessionState(ss: SessionState) {
  if (!ss) return null
  ss.globalState = getPersistedState(ss.globalState as any)
  for (let id in ss.windows) {
    ss.windows[id].state = getPersistedState(ss.windows[id].state as any)
  }
  return ss
}
