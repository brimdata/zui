import activeTabSelect from "../Tab/activeTabSelect"
import {actions} from "./reducer"

export default {
  getExpanded: activeTabSelect((t) => t.table.expanded),
  getDefaultExpanded: activeTabSelect((t) => t.table.defaultExpanded),
  getScrollPosition: activeTabSelect((t) => t.table.scrollPosition),
  getValuePages: activeTabSelect((t) => t.table.valuePages),
  getColumnWidths: activeTabSelect((t) => t.table.columnWidths),
  getState: activeTabSelect((t) => t.table),
  ...actions,
}
