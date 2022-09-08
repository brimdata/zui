import {getPersistedWindowState} from "src/js/state/stores/get-persistable"
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

export function decodeSessionState(ss: SessionState) {
  if (!ss) return null
  ss.globalState = getPersistedWindowState(ss.globalState as any)
  for (let id in ss.windows) {
    ss.windows[id].state = getPersistedWindowState(ss.windows[id].state as any)
  }
  return ss
}
