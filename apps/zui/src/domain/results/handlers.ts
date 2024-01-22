import {createHandler} from "src/core/handlers"
import Inspector from "src/js/state/Inspector"
import Layout from "src/js/state/Layout"
import Modal from "src/js/state/Modal"
import Table from "src/js/state/Table"
import {objectify} from "src/util/objectify"
import {find, getDecendentIds, walk} from "src/util/tree"
import {runHistogramQuery} from "src/views/histogram-pane/run-query"
import {addFuse, cutColumns} from "./utils"
import Results from "src/js/state/Results"
import {RESULTS_QUERY} from "src/views/results-pane/run-results-query"
import {ResponseFormat} from "@brimdata/zed-js"

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
  const prev = select(Table.getColumnVisible)
  const column = find(all, id)
  if (!column) throw new Error("No Column Found with id " + id)
  const ids = getDecendentIds(column)
  const state = objectify(ids, true)
  dispatch(Table.setColumnVisible({...prev, ...state}))
})

export const hideColumn = createHandler(({select, dispatch}, id: string) => {
  const all = select(Table.getNestedColumns)
  const prev = select(Table.getColumnVisible)
  const column = find(all, id)
  if (!column) throw new Error("No Column Found with id " + id)
  const ids = getDecendentIds(column)
  const state = objectify(ids, false)
  dispatch(Table.setColumnVisible({...prev, ...state}))
})

export const showAllColumns = createHandler(({select, dispatch}) => {
  const cols = select(Table.getNestedColumns)
  let ids = []
  for (let col of cols) ids = ids.concat(getDecendentIds(col))
  let state = objectify(ids, true)
  dispatch(Table.setColumnVisible(state))
})

export const hideAllColumns = createHandler(({select, dispatch}) => {
  const cols = select(Table.getNestedColumns)
  let ids = []
  for (let col of cols) ids = ids.concat(getDecendentIds(col))
  let state = objectify(ids, false)
  dispatch(Table.setColumnVisible(state))
})

export const expandAllColumns = createHandler(({select, dispatch}) => {
  const cols = select(Table.getNestedColumns)
  const ids = []
  walk(cols, (col) => {
    if (col.children) ids.push(col.id)
  })
  let state = objectify(ids, true)
  dispatch(Table.setColumnExpanded(state))
})

export const collapseAllColumns = createHandler(({select, dispatch}) => {
  const cols = select(Table.getNestedColumns)
  const ids = []
  walk(cols, (col) => {
    if (col.children) ids.push(col.id)
  })
  let state = objectify(ids, false)
  dispatch(Table.setColumnExpanded(state))
})

export const exportToFile = createHandler(
  async (ctx, format: ResponseFormat) => {
    const {canceled, filePath} = await ctx.invoke("showSaveDialogOp", {
      title: `Export Results as ${format.toUpperCase()}`,
      buttonLabel: "Export",
      defaultPath: `results.${format}`,
      properties: ["createDirectory"],
      showsTagField: false,
    })
    if (canceled) return

    const query = getExportQuery(format)
    const promise = ctx.invoke("results.exportToFile", query, format, filePath)
    ctx.toast
      .promise(promise, {
        loading: "Exporting...",
        success: "Export Completed: " + filePath,
        error: "Error Exporting",
      })
      .catch((e) => {
        console.error(e)
      })
  }
)

export const exportToClipboard = createHandler(
  async (ctx, format: ResponseFormat) => {
    const query = getExportQuery(format)
    await ctx.invoke("results.copyToClipboard", query, format)

    ctx.toast.success(`Copied ${format} data to clipboard.`)
  }
)

export const exportToPool = createHandler(async (ctx, poolId) => {
  const query = getExportQuery(null)
  await ctx.invoke("results.exportToPool", query, poolId)
  ctx.toast.success("Exported data to pool.")
})

export const getExportQuery = createHandler((ctx, format: ResponseFormat) => {
  const formatNeedsFuse = ["csv", "tsv", "arrows"]
  const query = ctx.select(Results.getQuery(RESULTS_QUERY))
  const isTable = ctx.select(Layout.getEffectiveResultsView) == "TABLE"
  const hiddenColCount = ctx.select(Table.getHiddenColumnCount)
  const columns = ctx.select(Table.getVisibleColumns).map((c) => c.name)

  let q = query
  if (isTable && hiddenColCount > 0) q = cutColumns(q, columns)
  if (formatNeedsFuse.includes(format)) q = addFuse(q)
  return q
})
