import {addFuse, cutColumns} from "../utils"
import Results from "src/js/state/Results"
import {RESULTS_QUERY} from "src/views/results-pane/run-results-query"
import {ResponseFormat} from "@brimdata/zed-js"
import {getOrCreatePool} from "../../pools/handlers"
import {errorToString} from "src/util/error-to-string"
import {createHandler} from "src/core/handlers"
import Layout from "src/js/state/Layout"
import Table from "src/js/state/Table"
import Tabs from "src/js/state/Tabs"
import {poolPath} from "src/app/router/utils/paths"

export const exportToPool = createHandler(
  async ({invoke, toast, dispatch}, data) => {
    const query = getExportQuery(null)
    try {
      const poolId = await getOrCreatePool(data)
      const promise = invoke(
        "results.exportToPool",
        query,
        poolId,
        globalThis.windowId
      )
      toast.promise(promise, {
        loading: "Exporting to pool...",
        success: "Export to pool complete",
        error: (e) => errorToString(e),
      })
      dispatch(Tabs.activateUrl(poolPath(poolId)))
      await promise
    } catch (e) {
      toast.error(errorToString(e))
    }
  }
)

export const exportToFile = createHandler(
  async (ctx, format: ResponseFormat) => {
    const {canceled, filePath} = await ctx.invoke("showSaveDialogOp", {
      title: `Export Results as ${format.toUpperCase()}`,
      buttonLabel: "Export",
      defaultPath: `results.${format}`,
      properties: ["createDirectory"],
      showsTagField: false,
    })
    if (canceled) return false

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
    return true
  }
)

export const exportToClipboard = createHandler(
  async (ctx, format: ResponseFormat) => {
    const query = getExportQuery(format)
    const promise = ctx.invoke("results.copyToClipboard", query, format)
    return ctx.toast.promise(promise, {
      loading: "Copying...",
      error: errorToString,
      success: (result) => {
        if (result === "success") return `Copied ${format} data to clipboard.`
        return "Copy Cancelled"
      },
    })
  }
)

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
