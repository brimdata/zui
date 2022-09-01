import {createOperation} from "../operations"
import {SearchAppMenuState} from "../windows/search/app-menu"
import {SearchWindow} from "../windows/search/search-window"

export const updateSearchAppMenuOp = createOperation(
  "updateSearchAppMenu",
  (main, e, args: {state: SearchAppMenuState; id: string}) => {
    const win = main.windows.find(args.id)
    if (win instanceof SearchWindow && win.ref.isFocused) {
      win.updateAppMenu(args.state)
    }
  }
)
