/* @flow */
import type {WindowName} from "../tron/windowManager"
import type {WindowParams} from "../tron/window"

export type IpcMsg =
  | WindowsRedirectMsg
  | ZqdIngestMsg
  | ZqdInfoMsg
  | ZqdSubscribeMsg

export type WindowsRedirectMsg = {
  channel: "windows:redirect",
  name: WindowName,
  params: WindowParams
}

export type ZqdIngestMsg = {
  channel: "zqd:ingest",
  space: string,
  paths: string[]
}

export type ZqdInfoMsg = {
  channel: "zqd:info"
}

export type ZqdSubscribeMsg = {
  channel: "zqd:subscribe"
}
