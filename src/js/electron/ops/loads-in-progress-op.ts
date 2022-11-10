import {createOperation} from "../operations"
import {SearchWindow} from "../windows/search/search-window"

export const loadStart = createOperation(
  "loadStart",
  ({main}, windowId: string) => {
    const win = main.windows.find(windowId)
    if (win && win instanceof SearchWindow) {
      win.loadsInProgress++
    }
  }
)

export const loadEnd = createOperation(
  "loadEnd",
  ({main}, windowId: string) => {
    const win = main.windows.find(windowId)
    if (win && win instanceof SearchWindow) {
      win.loadsInProgress--
    }
  }
)
