/* @flow */

import React from "react"

import type {RelatedLogs} from "../../types"
import {XUidTimeline} from "../UidTimeline"
import Log from "../../models/Log"

type Props = {log: Log, relatedLogs: RelatedLogs}

const UidPanel = ({log, relatedLogs}: Props) => {
  if (!relatedLogs["uid"] || relatedLogs["uid"].length <= 1) return null

  return (
    <div className="correlated-logs-panel detail-panel">
      <h4 className="small-heading">Uid Correlation</h4>
      <XUidTimeline log={log} logs={relatedLogs["uid"]} />
    </div>
  )
}

export default UidPanel
