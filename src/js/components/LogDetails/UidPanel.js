/* @flow */

import React from "react"

import type {RelatedLogs} from "../../types"
import {XUidTimeline} from "../UidTimeline"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"

type Props = {
  log: Log,
  relatedLogs: RelatedLogs,
  statuses: {[string]: string}
}

const UidPanel = ({log, relatedLogs, statuses}: Props) => {
  if (!log.correlationId()) return null

  const {uid} = relatedLogs

  return (
    <div className="correlated-logs-panel detail-panel">
      <PanelHeading status={statuses["UidSearch"]}>
        Uid Correlation
      </PanelHeading>
      {uid.length === 0 && (
        <InlineTableLoading title="Loading timeline..." rows={3} />
      )}
      <XUidTimeline log={log} logs={relatedLogs["uid"]} />
    </div>
  )
}

export default UidPanel
