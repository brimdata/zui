import log from "electron-log"
import {dimensFromSizePosition} from "./dimens"
import {DetailWindow} from "./detail-window"
import {SearchWindow} from "./search-window"
import {AboutWindow} from "./about-window"
import {SerializedWindow, WindowProps} from "./types"
import {WindowName} from "./types"
import {HiddenWindow} from "./hidden-window"

export function deserializeWindow(data: SerializedWindow) {
  const props = {
    id: data.id,
    state: data.state,
    dimens: dimensFromSizePosition(data.size, data.position),
  }
  return createWindow(data.name, props)
}

export function createWindow(name: WindowName, props: WindowProps) {
  switch (name) {
    case "search":
      return new SearchWindow(props)
    case "about":
      return new AboutWindow(props)
    case "detail":
      return new DetailWindow(props)
    case "hidden":
      return new HiddenWindow(props)
    default:
      log.error("Unknown Window Type: ", name)
  }
}
