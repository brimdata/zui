import {useSelector} from "react-redux"
import React from "react"

import {XUidTimeline} from "../UidTimeline"
import {reactElementProps} from "../../test/integration"
import {toFront} from "../../lib/Array"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import LogDetails from "../../state/LogDetails"
import PanelHeading from "./PanelHeading"
import brim from "../../brim"

export default function UidPanel({log}: {log: Log}) {
  const status = useSelector(LogDetails.getUidStatus)
  const logs = useSelector(LogDetails.getUidLogs)
    .map(brim.record)
    .map(brim.interop.recordToLog)

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
  const findConn = (log) => log.getString("_path") === "conn"
  return toFront(Log.sort(logs, "ts"), findConn)
}
