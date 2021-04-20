import detailFieldContextMenu from "ppl/menus/detailFieldContextMenu"
import searchFieldContextMenu from "ppl/menus/searchFieldContextMenu"
import {showContextMenu} from "src/js/lib/System"
import Columns from "src/js/state/Columns"
import Current from "src/js/state/Current"
import SearchBar from "src/js/state/SearchBar"
import {ZedField, ZedRecord} from "zealot/zed"

const contextMenu = (field: ZedField, record: ZedRecord) => (_, getState) => {
  const space = Current.mustGetSpace(getState())
  const program = SearchBar.getSearchProgram(getState())
  const tableColumns = Columns.getCurrentTableColumns(getState())
  const columns = tableColumns.getColumns().map((c) => c.name)
  const builder =
    global.windowName === "detail"
      ? detailFieldContextMenu
      : searchFieldContextMenu

  showContextMenu(builder(program, columns, space)(field, record, false))
}

export default contextMenu
