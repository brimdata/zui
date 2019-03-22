/* @flow */

import React from "react"

import type {RelatedLogs} from "../types"
import {XUidTimeline} from "./UidTimeline"
import ConnVersation from "./ConnVersation"
import FieldsTable from "./FieldsTable"
import Log from "../models/Log"

type Props = {|
  log: Log,
  relatedLogs: RelatedLogs
|}

export default class LogDetail extends React.Component<Props> {
  el: ?HTMLElement

  render() {
    const {log, relatedLogs} = this.props

    return (
      <div className="log-detail">
        <div className="fields-table-panel detail-panel">
          <h4 className="small-heading">Fields</h4>
          <FieldsTable log={log} />
        </div>

        {relatedLogs["uid"] && relatedLogs["uid"].length > 1 && (
          <div className="correlated-logs-panel detail-panel">
            <h4 className="small-heading">Correlated Logs</h4>
            <XUidTimeline log={log} logs={relatedLogs["uid"]} />
          </div>
        )}

        {ConnVersation.shouldShow(log) && (
          <div className="conn-versation-panel detail-panel">
            <h4 className="small-heading">Conn History</h4>
            <ConnVersation log={log} />
          </div>
        )}
      </div>
    )
  }
}
