/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {XUidTimeline} from "../UidTimeline"
import {reactElementProps} from "../../test/integration"
import {toFront} from "../../lib/Array"
import {uidCorrelation} from "../../searches/programs"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import Tab from "../../state/tab"
import brim from "../../brim"
import executeSearch from "../../flows/executeSearch"

export default function UidPanel({log}: {log: Log}) {
  let dispatch = useDispatch()
  let [logs, setLogs] = useState([])
  let [status, setStatus] = useState("INIT")
  let span = useSelector(Tab.getSpanAsDates)
  let space = useSelector(Tab.spaceName)
  let program = uidCorrelation(log.correlationId())

  useEffect(() => {
    let uid = brim
      .search(program, span, space)
      .id("UidTimeline")
      .status(setStatus)
      .chan(0, (records) => {
        setLogs(
          logs.concat(records.map(brim.record).map(brim.interop.recordToLog))
        )
      })
    return dispatch(executeSearch(uid))
  }, [])

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
