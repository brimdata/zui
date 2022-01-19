import activeTabSelect from "../Tab/activeTabSelect"

export default {
  getDetailPaneWidth: activeTabSelect(
    (state) => state.layout.rightSidebarWidth
  ),

  getDetailPaneIsOpen: activeTabSelect(
    (state) => state.layout.rightSidebarIsOpen
  ),

  // TODO: Mason - reset history view in migration

  getColumnsView: activeTabSelect((state) => state.layout.columnHeadersView),

  getResultsView: activeTabSelect((s) => s.layout.resultsView)
}
