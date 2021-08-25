import detailFieldContextMenu from "ppl/menus/detailFieldContextMenu"
import searchFieldContextMenu from "ppl/menus/searchFieldContextMenu"
import {Thunk} from "src/js/state/types"
import {zed} from "zealot"

const contextMenu = (field: zed.Field, record: zed.Record): Thunk => (
  dispatch
) => {
  if (global.windowName === "detail") {
    dispatch(detailFieldContextMenu({field, record, value: field.value}))
  } else {
    dispatch(searchFieldContextMenu({field, record, value: field.value}))
  }
}

export default contextMenu
