import {useSelector} from "react-redux"
import React from "react"

import {XUidTimeline} from "../UidTimeline"
import {reactElementProps} from "../../test/integration"
import {toFront} from "../../lib/Array"
import InlineTableLoading from "../InlineTableLoading"
import LogDetails from "../../state/LogDetails"
import PanelHeading from "./PanelHeading"
import {zng} from "zealot"

export default function UidPanel({log}: {log: zng.Record}) {
  const status = useSelector(LogDetails.getUidStatus)
  const logs = useSelector(LogDetails.getUidLogs)

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

const uidOrder = (logs: zng.Record[]) => {
  const findConn = (log) => log.try("_path")?.toString() === "conn"
  return toFront(sort(logs, "ts"), findConn)
}

function sort(logs: zng.Record[], name: string, dir: "asc" | "desc" = "asc") {
  const direction = dir === "asc" ? 1 : -1

  logs.sort((a, b) =>
    a.try(name)?.toString() > b.try(name)?.toString()
      ? direction
      : direction * -1
  )

  return logs
}
