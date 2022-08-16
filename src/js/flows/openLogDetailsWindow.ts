import {openDetailWindow} from "src/js/electron/ops/open-detail-window"
import {Thunk} from "../state/types"

export const openLogDetailsWindow =
  (): Thunk =>
  async (dispatch, getState, {api}) => {
    // invoke(ipc.windows.open("detail", {size: [700, 600], query: {href}}, state))
    await openDetailWindow.invoke({value: api.current.value})
  }
