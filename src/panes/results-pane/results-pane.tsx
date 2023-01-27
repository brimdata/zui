import React, {useRef} from "react"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import {ResultsPaneProvider, useResultsPaneContext} from "./context"
import {Error} from "./error"
import {Inspector} from "./inspector"
import {Table} from "./table"
import {TableInspector} from "./table-inspector"

export function ResultsPane() {
  const ref = useRef()
  return (
    <div ref={ref} className="results-pane" data-test-locator="viewer_results">
      <AppErrorBoundary>
        <ResultsPaneProvider parentRef={ref}>
          <ResultsView />
        </ResultsPaneProvider>
      </AppErrorBoundary>
    </div>
  )
}

function ResultsView() {
  const ctx = useResultsPaneContext()
  if (ctx.error) return <Error error={ctx.error} />
  if (ctx.view === "TABLE") {
    if (!ctx.firstShape) return null
    if (ctx.isSingleShape) return <Table />
    return <TableInspector />
  }
  if (ctx.view === "INSPECTOR") return <Inspector />
  return null
}
