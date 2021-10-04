import activeTabSelect from "../Tab/activeTabSelect"
import {TabState} from "../Tab/types"

export default {
  getRightSidebarWidth: activeTabSelect(
    (state: TabState) => state.layout.rightSidebarWidth
  ),

  getRightSidebarIsOpen: activeTabSelect(
    (state: TabState) => state.layout.rightSidebarIsOpen
  ),

  getInvestigationView: activeTabSelect(
    (state: TabState) => state.layout.investigationView
  ),

  getColumnHeadersView: activeTabSelect(
    (state: TabState) => state.layout.columnHeadersView
  )
}
