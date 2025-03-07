import React, {useRef} from "react"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import {ResultsPaneProvider, useResultsPaneContext} from "./context"
import {Error} from "./error"
import {Inspector} from "./inspector"
import {Table} from "./table"
import {TableInspector} from "./table-inspector"
import styles from "./results-pane.module.css"
import {useTimeFormat, useTimeZone} from "src/components/format"

export function ResultsPane() {
  useTimeZone()
  useTimeFormat()
  const ref = useRef()
  return (
    <div
      ref={ref}
      className={"results-pane " + styles.container}
      data-testid="results-pane"
    >
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
    if (ctx.isSingleRecordShape) return <Table />
    return <TableInspector />
  }
  if (ctx.view === "INSPECTOR") return <Inspector />
  return null
}
