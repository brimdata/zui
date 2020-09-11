import {createSelector} from "reselect"

import {ColumnsState} from "./types"
import {State} from "../types"
import {ViewerColumns} from "../Viewer/types"
import {createColumnSet} from "./models/columnSet"
import Log from "../../models/Log"
import TableColumns from "../../models/TableColumns"
import Viewer from "../Viewer"
import activeTabSelect from "../Tab/activeTabSelect"

const getColumns = activeTabSelect<ColumnsState>((tab) => tab.columns)

const getCurrentTableColumns = createSelector<
  State,
  ViewerColumns,
  ColumnsState,
  Log[],
  TableColumns
>(
  Viewer.getColumns,
  getColumns,
  Viewer.getLogs,
  (viewerColumns, columnSettings, logs) => {
    const set = createColumnSet(viewerColumns)
    const prefs = columnSettings[set.getName()]
    const table = new TableColumns(set.getName(), set.getUniqColumns(), prefs)
    table.setWidths(logs.slice(0, 50))
    return table
  }
)

export default {
  getCurrentTableColumns,
  getColumns
}
