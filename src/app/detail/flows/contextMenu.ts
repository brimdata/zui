import detailFieldContextMenu from "src/ppl/menus/detailFieldContextMenu"
import searchFieldContextMenu from "src/ppl/menus/searchFieldContextMenu"
import {zed} from "@brimdata/zealot"

const contextMenu = (field: zed.Field, record: zed.Record) => (dispatch) => {
  if (global.windowName === "detail") {
    dispatch(detailFieldContextMenu({field, record, value: field.value}))
  } else {
    dispatch(searchFieldContextMenu({field, record, value: field.value}))
  }
}

export default contextMenu
