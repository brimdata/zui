import {createSelector} from "@reduxjs/toolkit"
import activeTabSelect from "../Tab/activeTabSelect"
import {RESULTS_QUERY} from "src/panes/results-pane/run-results-query"
import {getShapes} from "../Results/selectors"

const getResultsView = activeTabSelect((s) => s.layout.resultsView)

const getEffectiveResultsView = createSelector(
  getResultsView,
  getShapes(RESULTS_QUERY),
  (view, shapes) => {
    const isSingleShape = Object.values(shapes).length === 1
    if (isSingleShape) return view
    else return "INSPECTOR"
  }
)

export default {
  getResultsView,
  getEffectiveResultsView,
  getCurrentPaneName: activeTabSelect((state) => state.layout.currentPaneName),
  getColumnsView: activeTabSelect((state) => state.layout.columnHeadersView),
  getIsEditingTitle: activeTabSelect((s) => s.layout.isEditingTitle),
  getTitleFormAction: activeTabSelect((s) => s.layout.titleFormAction),
  getShowHistogram: activeTabSelect((s) => s.layout.showHistogram ?? true),
  getQueryPanels: activeTabSelect((s) => s.layout.queryPanels),
}
