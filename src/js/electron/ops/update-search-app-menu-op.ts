import {createOperation} from "../operations"
import {SearchAppMenuState} from "../windows/search/app-menu"
import {SearchWindow} from "../windows/search/search-window"

export const updateSearchAppMenuOp = createOperation(
  "updateSearchAppMenu",
  ({main}, id: string, state: SearchAppMenuState) => {
    const win = main.windows.find(id)
    if (win instanceof SearchWindow && win.ref.isFocused) {
      win.updateAppMenu(state)
    }
  }
)
