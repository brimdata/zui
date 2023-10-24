export type ResultsHandlers = {
  "results.expandAll": () => void
  "results.collapseAll": () => void
  "results.showExportDialog": () => void
  "results.toggleHistogram": () => void
}

export type ResultsOperations = {
  "results.export": (query: string, format: string, filePath: string) => string
}
