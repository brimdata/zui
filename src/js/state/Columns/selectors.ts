import {createSelector} from "reselect"
import {ZedRecord} from "zealot/zed/data-types"
import TableColumns from "../../models/TableColumns"
import activeTabSelect from "../Tab/activeTabSelect"
import {State} from "../types"
import Viewer from "../Viewer"
import {ViewerColumns} from "../Viewer/types"
import {createColumnSet} from "./models/columnSet"
import {ColumnsState} from "./types"

const getColumns = activeTabSelect<ColumnsState>((tab) => tab.columns)

const getCurrentTableColumns = createSelector<
  State,
  ViewerColumns,
  ColumnsState,
  ZedRecord[],
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
