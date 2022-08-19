import log from "electron-log"
import {dimensFromSizePosition} from "../window/dimens"
import {DetailWindow} from "./detail-window"
import {SearchWindow} from "./search-window"
import {AboutWindow} from "./about-window"
import {SerializedWindow} from "./types"

export function constructWindow(data: SerializedWindow) {
  const props = {
    id: data.id,
    state: data.state,
    dimens: dimensFromSizePosition(data.size, data.position),
  }

  switch (data.name) {
    case "search":
      return new SearchWindow(props)
    case "about":
      return new AboutWindow(props)
    case "detail":
      return new DetailWindow(props)
    default:
      log.error("Unknown Window Type: ", data.name)
  }
}
