/* @flow */
import type {WindowName} from "../tron/windowManager"
import type {WindowParams} from "../tron/window"
import type {NewTabSearchParams} from "./windows/messages"
import type {State} from "../../state/types"

export type IpcMsg =
  | WindowsOpenMsg
  | WindowsCloseMsg
  | WindowsInitialStateMsg
  | WindowsDestroyMsg
  | WindowsNewSearchTabMsg
  | WindowsOpenDirectorySelect
  | GlobalStoreInitMsg
  | GlobalStoreDispatchMsg

export type WindowsOpenMsg = {
  channel: "windows:open",
  name: WindowName,
  params: WindowParams,
  state: State
}

export type WindowsCloseMsg = {
  channel: "windows:close"
}

export type WindowsInitialStateMsg = {
  channel: "windows:initialState",
  id: string
}

export type WindowsDestroyMsg = {
  channel: "windows:destroy"
}

export type WindowsNewSearchTabMsg = {
  channel: "windows:newSearchTab",
  params: NewTabSearchParams
}

export type WindowsOpenDirectorySelect = {
  channel: "windows:openDirectorySelect"
}

export type GlobalStoreInitMsg = {
  channel: "globalStore:init"
}

export type GlobalStoreDispatchMsg = {
  channel: "globalStore:dispatch"
}
