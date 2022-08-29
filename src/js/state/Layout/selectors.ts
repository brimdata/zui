import activeTabSelect from "../Tab/activeTabSelect"

export default {
  getDetailPaneWidth: activeTabSelect(
    (state) => state.layout.rightSidebarWidth
  ),
  getDetailPaneIsOpen: activeTabSelect(
    (state) => state.layout.rightSidebarIsOpen
  ),
  getCurrentPaneName: activeTabSelect((state) => state.layout.currentPaneName),
  getColumnsView: activeTabSelect((state) => state.layout.columnHeadersView),
  getResultsView: activeTabSelect((s) => s.layout.resultsView),
  getIsEditingTitle: activeTabSelect((s) => s.layout.isEditingTitle),
  getTitleFormAction: activeTabSelect((s) => s.layout.titleFormAction),
  getShowHistogram: activeTabSelect((s) => s.layout.showHistogram ?? true),
}
