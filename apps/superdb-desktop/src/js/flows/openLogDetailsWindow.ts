import * as zed from "../../../../../packages/superdb-types/dist"
import Current from "../state/Current"
import {Thunk} from "../state/types"
import {invoke} from "src/core/invoke"

export const openLogDetailsWindow =
  (value: zed.Value): Thunk =>
  async (dispatch, getState) => {
    await invoke("detailWindow.open", {
      value: zed.encode(value),
      url: Current.getLocation(getState()).pathname,
    })
  }
