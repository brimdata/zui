import {createHandler} from "src/core/handlers"
import Inspector from "src/js/state/Inspector"
import Layout from "src/js/state/Layout"
import Modal from "src/js/state/Modal"
import Table from "src/js/state/Table"
import {runHistogramQuery} from "src/views/histogram-pane/run-query"

export const expandAllHandler = createHandler(
  "results.expandAll",
  ({dispatch}) => {
    dispatch(Inspector.setExpanded({}))
    dispatch(Inspector.setExpandedDefault(true))
  }
)

export const collapseAllHandler = createHandler(
  "results.collapseAll",
  ({dispatch, select}) => {
    const view = select(Layout.getEffectiveResultsView)

    if (view === "INSPECTOR") {
      dispatch(Inspector.setExpanded({}))
      dispatch(Inspector.setExpandedDefault(false))
    } else {
      dispatch(Table.setValueExpanded({}))
    }
  }
)

export const showExportDialog = createHandler(
  "results.showExportDialog",
  ({dispatch}) => {
    dispatch(Modal.show("export"))
  }
)

export const toggleHistogram = createHandler(
  "results.toggleHistogram",
  ({dispatch, select, oldApi}) => {
    const isShown = select(Layout.getShowHistogram)
    if (!isShown) runHistogramQuery(oldApi)
    dispatch(Layout.toggleHistogram())
  }
)

export const showTableView = createHandler((ctx) => {
  ctx.transition(() => {
    ctx.dispatch(Layout.setResultsView("TABLE"))
  })
})

export const showInspectorView = createHandler((ctx) => {
  ctx.transition(() => {
    ctx.dispatch(Layout.setResultsView("INSPECTOR"))
  })
})

export const showChartView = createHandler((ctx) => {
  ctx.transition(() => {
    ctx.dispatch(Layout.setResultsView("CHART"))
  })
})
