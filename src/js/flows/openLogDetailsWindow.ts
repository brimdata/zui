import {encode, zed} from "@brimdata/zealot"
import {openDetailWindow} from "src/js/electron/ops/open-detail-window-op"
import Current from "../state/Current"
import {Thunk} from "../state/types"

export const openLogDetailsWindow =
  (value: zed.Value): Thunk =>
  async (dispatch, getState) => {
    await openDetailWindow.invoke({
      value: encode(value),
      url: Current.getLocation(getState()).pathname,
    })
  }
