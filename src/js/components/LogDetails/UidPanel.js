/* @flow */

import React from "react"

import type {PanelProps} from "./"
import {XUidTimeline} from "../UidTimeline"
import {reactElementProps} from "../../test/integration"
import {toFront} from "../../lib/Array"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import useSearch from "../../hooks/useSearch"

export const UID_CORRELATION_LIMIT = 100

export default function UidPanel({log}: PanelProps) {
  let [logs, status] = useSearch({
    program: log.correlationId() + " | head " + UID_CORRELATION_LIMIT
  })

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
