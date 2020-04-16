/* @flow */
import type {WindowName} from "../tron/windowManager"
import type {WindowParams} from "../tron/window"

export type IpcMsg =
  | WindowsRedirectMsg
  | WindowsCloseMsg
  | WindowsInitialStateMsg
  | WindowsDestroyMsg
  | GlobalStoreInitMsg
  | GlobalStoreDispatchMsg

export type WindowsRedirectMsg = {
  channel: "windows:redirect",
  name: WindowName,
  params: WindowParams
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

export type GlobalStoreInitMsg = {
  channel: "globalStore:init"
}

export type GlobalStoreDispatchMsg = {
  channel: "globalStore:dispatch"
}
