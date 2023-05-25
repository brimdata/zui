export type ResultsHandlers = {
  "results.expandAll": []
  "results.collapseAll": []
  "results.showExportDialog": []
}

export type ResultsOperations = {
  "results.export": (query: string, format: string, filePath: string) => string
}
