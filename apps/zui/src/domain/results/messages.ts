import * as ops from "./operations"
import * as hands from "./handlers/view"

export type ResultsHandlers = {
  "results.expandAll": typeof hands.expandAllHandler
  "results.collapseAll": typeof hands.collapseAllHandler
  "results.showExportDialog": typeof hands.showExportDialog
  "results.toggleHistogram": typeof hands.toggleHistogram
}

export type ResultsOperations = {
  "results.exportToFile": typeof ops.exportToFile
  "results.copyToClipboard": typeof ops.copyToClipboard
  "results.cancelCopyToClipboard": typeof ops.cancelCopyToClipboard
  "results.exportToPool": typeof ops.exportToPool
}
