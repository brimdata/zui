import {createHandler} from "src/core/handlers"
import Inspector from "src/js/state/Inspector"
import Layout from "src/js/state/Layout"
import Modal from "src/js/state/Modal"
import Table from "src/js/state/Table"
import {find, getDecendentIds} from "src/util/tree"
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

export const expandColumn = createHandler((ctx, id: string) => {
  ctx.dispatch(Table.expandColumn(id))
})

export const collapseColumn = createHandler((ctx, id: string) => {
  ctx.dispatch(Table.collapseColumn(id))
})

export const showColumn = createHandler(({select, dispatch}, id: string) => {
  const all = select(Table.getNestedColumns)
  const column = find(all, id)
  if (!column) throw new Error("No Column Found with id " + id)
  const ids = getDecendentIds(column)
  const state = {}
  for (id of ids) state[id] = true
  dispatch(Table.setColumnVisible(state))
})

export const hideColumn = createHandler(({select, dispatch}, id: string) => {
  const all = select(Table.getNestedColumns)
  const column = find(all, id)
  if (!column) throw new Error("No Column Found with id " + id)
  const ids = getDecendentIds(column)
  const state = {}
  for (id of ids) state[id] = false
  dispatch(Table.setColumnVisible(state))
})

export const showAllColumns = createHandler(({select, dispatch}) => {
  const cols = select(Table.getNestedColumns)
  let ids = []
  for (let col of cols) ids = ids.concat(getDecendentIds(col))
  let state = {}
  for (let id of ids) state[id] = true
  dispatch(Table.setColumnVisible(state))
})

export const hideAllColumns = createHandler(({select, dispatch}) => {
  const cols = select(Table.getNestedColumns)
  let ids = []
  for (let col of cols) ids = ids.concat(getDecendentIds(col))
  let state = {}
  for (let id of ids) state[id] = false
  dispatch(Table.setColumnVisible(state))
})
