/* @flow */
import type {WindowName} from "../tron/windowManager"
import type {WindowParams} from "../tron/window"

export type IpcMsg = WindowsRedirectMsg | ZqdIngestMsg | ZqdInfoMsg

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
