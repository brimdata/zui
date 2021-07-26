import brim from "src/js/brim"
import {ViewAction, ViewState} from "./types"

const init: ViewState = {
  downloadsIsOpen: false,
  timeZone: "UTC"
}

export default function reducer(
  state: ViewState = init,
  action: ViewAction
): ViewState {
  switch (action.type) {
    case "TIME_ZONE_SET":
      brim.time.setZone(action.timeZone)
      return {
        ...state,
        timeZone: action.timeZone
      }
    case "DOWNLOADS_SHOW":
      return {
        ...state,
        downloadsIsOpen: true
      }
    case "DOWNLOADS_HIDE":
      return {
        ...state,
        downloadsIsOpen: false
      }
    default:
      return state
  }
}
