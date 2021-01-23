import {WindowName} from "../tron/windowManager"
import {WindowParams} from "../tron/window"
import {NewTabSearchParams} from "./windows/messages"
import {State} from "../../state/types"

export type IpcMsg =
  | WindowsOpenMsg
  | WindowsInitialStateMsg
  | WindowsNewSearchTabMsg
  | WindowsOpenDirectorySelect
  | WindowsAuthCallbackMsg
  | WindowsSetKeyStorageMsg
  | WindowsGetKeyStorageMsg
  | WindowsDeleteKeyStorageMsg
  | GlobalStoreInitMsg
  | GlobalStoreDispatchMsg

export type WindowsOpenMsg = {
  channel: "windows:open"
  name: WindowName
  params: Partial<WindowParams>
  state: State
}

export type WindowsAuthCallbackMsg = {
  channel: "windows:authCallback"
  workspaceId: string
  code: string
}

export type WindowsInitialStateMsg = {
  channel: "windows:initialState"
  id: string
}

export type WindowsNewSearchTabMsg = {
  channel: "windows:newSearchTab"
  params: NewTabSearchParams
}

export type WindowsOpenDirectorySelect = {
  channel: "windows:openDirectorySelect"
}

export type WindowsSetKeyStorageMsg = {
  channel: "windows:setKeyStorage"
  key: string
  val: string
}

export type WindowsGetKeyStorageMsg = {
  channel: "windows:getKeyStorage"
  key: string
}

export type WindowsDeleteKeyStorageMsg = {
  channel: "windows:deleteKeyStorage"
  key: string
}

export type GlobalStoreInitMsg = {
  channel: "globalStore:init"
}

export interface GlobalStoreDispatchMsg {
  channel: "globalStore:dispatch"
  action: object
}
