import {createSelector} from "reselect"
import {zed} from "zealot"
import TableColumns from "../../models/TableColumns"
import activeTabSelect from "../Tab/activeTabSelect"
import {State} from "../types"
import Viewer from "../Viewer"
import {SchemaMap} from "../Viewer/types"
import {createColumnSet} from "./models/columnSet"
import {ColumnsState} from "./types"

const getColumns = activeTabSelect<ColumnsState>((tab) => tab.columns)

const getCurrentTableColumns = createSelector<
  State,
  SchemaMap,
  ColumnsState,
  zed.Record[],
  TableColumns
>(
  Viewer.getColumns,
  getColumns,
  Viewer.getRecords,
  (viewerColumns, columnSettings, logs) => {
    const set = createColumnSet(viewerColumns)
    const prefs = columnSettings[set.getName()]
    const table = new TableColumns(
      set.getName() as string,
      set.getUniqColumns(),
      prefs
    )
    table.setWidths(logs.slice(0, 50))
    return table
  }
)

export default {
  getCurrentTableColumns,
  getColumns
}
