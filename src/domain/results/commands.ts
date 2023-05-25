import {createCommand} from "src/core/command"
import {results} from "src/zui"

export const expandAll = createCommand("results.expandAll", () => {
  results.expandAll()
})

export const collapseAll = createCommand("results.collapseAll", () => {
  results.collapseAll()
})

export const showExportDialog = createCommand(
  "results.showExportDialog",
  () => {
    results.showExportDialog()
  }
)
