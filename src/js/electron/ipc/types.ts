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
  | GlobalStoreInitMsg
  | GlobalStoreDispatchMsg
  | SecretsStorageSetKeyMsg
  | SecretsStorageGetKeyMsg
  | SecretsStorageDeleteKeyMsg

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

export type GlobalStoreInitMsg = {
  channel: "globalStore:init"
}

export interface GlobalStoreDispatchMsg {
  channel: "globalStore:dispatch"
  action: object
}

export type SecretsStorageSetKeyMsg = {
  channel: "secretStorage:setKey"
  key: string
  val: string
}

export type SecretsStorageGetKeyMsg = {
  channel: "secretStorage:getKey"
  key: string
}

export type SecretsStorageDeleteKeyMsg = {
  channel: "secretStorage:deleteKey"
  key: string
}
