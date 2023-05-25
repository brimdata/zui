import {dimensFromSizePosition} from "./dimens"
import {DetailWindow} from "./detail-window"
import {SearchWindow} from "./search/search-window"
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
      return new SearchWindow(props).init()
    case "about":
      return new AboutWindow(props).init()
    case "detail":
      return new DetailWindow(props).init()
    case "hidden":
      return new HiddenWindow(props).init()
    default:
      throw new Error("Unknown Window Type: ", name)
  }
}
