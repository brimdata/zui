import {useSelector} from "react-redux"
import React from "react"

import {reactElementProps} from "../../test/integration"
import InlineTableLoading from "../InlineTableLoading"
import LogDetails from "../../state/LogDetails"
import PanelHeading from "./PanelHeading"
import {zng} from "zealot"
import ZeekCorrelation from "../../correlation/components/ZeekCorrelation"

export default function UidPanel({log}: {log: zng.Record}) {
  const status = useSelector(LogDetails.getUidStatus)
  const logs = useSelector(LogDetails.getUidLogs)
  return (
    <div
      className="correlated-logs-panel detail-panel"
      {...reactElementProps("correlationPanel")}
    >
      <PanelHeading status={status}>Correlation</PanelHeading>
      {logs.length === 0 && status !== "SUCCESS" && (
        <InlineTableLoading title="Loading timeline..." rows={3} />
      )}
      <ZeekCorrelation log={log} logs={logs} />
    </div>
  )
}
