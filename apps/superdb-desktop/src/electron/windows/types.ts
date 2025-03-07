import {Dimens} from "./dimens"
import {ZuiWindow} from "./zui-window"

export type WindowProps = {
  id?: string
  dimens?: Dimens
  state?: any
}

export type SerializedWindow = {
  id: string
  name: WindowName
  position: [number, number]
  size: [number, number]
  lastFocused: number
  state: any
}

export type WindowName = "search" | "about" | "detail" | "hidden" | "update"

export type WindowsState = {
  [key: string]: ZuiWindow
}
