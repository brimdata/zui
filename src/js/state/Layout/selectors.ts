import activeTabSelect from "../Tab/activeTabSelect"

export default {
  getDetailPaneWidth: activeTabSelect(
    (state) => state.layout.rightSidebarWidth
  ),

  getDetailPaneIsOpen: activeTabSelect(
    (state) => state.layout.rightSidebarIsOpen
  ),

  getColumnsView: activeTabSelect((state) => state.layout.columnHeadersView),

  getResultsView: activeTabSelect((s) => s.layout.resultsView),
}
