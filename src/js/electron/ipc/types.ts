import {NewTabSearchParams} from "./windows/messages"

export type IpcMsg =
  | WindowsInitialStateMsg
  | WindowsNewSearchTabMsg
  | WindowsOpenDirectorySelect
  | WindowsAuthCallbackMsg
  | GlobalStoreInitMsg
  | GlobalStoreDispatchMsg
  | SecretsSetKeyMsg
  | SecretsGetKeyMsg
  | SecretsDeleteKeyMsg

export type WindowsAuthCallbackMsg = {
  channel: "windows:authCallback"
  lakeId: string
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

export type SecretsSetKeyMsg = {
  channel: "secrets:setKey"
  key: string
  val: string
}

export type SecretsGetKeyMsg = {
  channel: "secrets:getKey"
  key: string
}

export type SecretsDeleteKeyMsg = {
  channel: "secrets:deleteKey"
  key: string
}
