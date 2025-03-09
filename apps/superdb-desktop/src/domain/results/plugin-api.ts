import {sendToFocusedWindow} from "src/core/ipc"

export class ResultsApi {
  expandAll() {
    sendToFocusedWindow("results.expandAll")
  }
  collapseAll() {
    sendToFocusedWindow("results.collapseAll")
  }
  showExportDialog() {
    sendToFocusedWindow("results.showExportDialog")
  }
  toggleHistogram() {
    sendToFocusedWindow("results.toggleHistogram")
  }
}
