import {WindowName} from "../windows/window-manager"
import {Dimens} from "../windows/dimens"

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
