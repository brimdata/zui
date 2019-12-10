/* @flow */

import React from "react"

import {XUidTimeline} from "../UidTimeline"
import {reactElementProps} from "../../test/integration"
import {resultsToLogs} from "../../models/resultsToLogs"
import {toFront} from "../../lib/Array"
import {uidCorrelation} from "../../searches/programs"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import useSearch from "../hooks/useSearch"

export default function UidPanel({log}: {log: Log}) {
  let [results, status] = useSearch({
    name: "UidSearch",
    program: uidCorrelation(log.correlationId())
  })
  let logs = resultsToLogs(results)

  return (
    <div
      className="correlated-logs-panel detail-panel"
      {...reactElementProps("correlationPanel")}
    >
      <PanelHeading status={status}>Uid Correlation</PanelHeading>
      {logs.length === 0 && (
        <InlineTableLoading title="Loading timeline..." rows={3} />
      )}
      <XUidTimeline log={log} logs={uidOrder(logs)} />
    </div>
  )
}

const uidOrder = (logs: Log[]) => {
  const findConn = (log) => log.get("_path") === "conn"
  return toFront(Log.sort(logs, "ts"), findConn)
}
