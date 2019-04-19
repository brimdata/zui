/* @flow */

import React from "react"

import type {PanelProps} from "./"
import {XUidTimeline} from "../UidTimeline"
import {resultsToLogs} from "../../log/resultsToLogs"
import InlineTableLoading from "../InlineTableLoading"
import PanelHeading from "./PanelHeading"

const UidPanel = ({log, searches}: PanelProps) => {
  if (!log.correlationId()) return null
  const search = searches.find((s) => s.name === "UidSearch")
  if (!search) return null

  const logs = resultsToLogs(search.results, "0")

  return (
    <div className="correlated-logs-panel detail-panel">
      <PanelHeading status={search.status}>Uid Correlation</PanelHeading>
      {logs.length === 0 && (
        <InlineTableLoading title="Loading timeline..." rows={3} />
      )}
      <XUidTimeline log={log} logs={logs} />
    </div>
  )
}

export default UidPanel
