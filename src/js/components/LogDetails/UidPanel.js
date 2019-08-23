/* @flow */

import React from "react"

import type {PanelProps} from "./"
import {XUidTimeline} from "../UidTimeline"
import {reactElementProps} from "../../test/integration"
import {resultsToLogs} from "../../log/resultsToLogs"
import {toFront} from "../../lib/Array"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"

const UidPanel = ({log, searches}: PanelProps) => {
  if (!log.correlationId()) return null
  const search = searches.find((s) => s.name === "UidSearch")
  if (!search) return null

  const logs = uidOrder(resultsToLogs(search.results, "0"))

  return (
    <div
      className="correlated-logs-panel detail-panel"
      {...reactElementProps("correlationPanel")}
    >
      <PanelHeading status={search.status}>Uid Correlation</PanelHeading>
      {logs.length === 0 && (
        <InlineTableLoading title="Loading timeline..." rows={3} />
      )}
      <XUidTimeline log={log} logs={logs} />
    </div>
  )
}

const uidOrder = (logs: Log[]) => {
  const findConn = (log) => log.get("_path") === "conn"
  return toFront(Log.sort(logs, "ts"), findConn)
}

export default UidPanel
