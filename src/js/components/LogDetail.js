/* @flow */

import React from "react"

import {XHashCorrelation} from "./HashCorrelation"
import ConnVersation from "./ConnVersation"
import FieldsTable from "./FieldsTable"
import Log from "../models/Log"
import UidTimeline from "./UidTimeline"

type Props = {
  log: Log,
  correlatedLogs: Log[],
  viewLogDetail: Function
}

export default class LogDetail extends React.Component<Props> {
  el: ?HTMLElement

  render() {
    const {log, correlatedLogs, viewLogDetail} = this.props

    return (
      <div className="log-detail">
        <div className="fields-table-panel detail-panel">
          <h4 className="small-heading">Fields</h4>
          <FieldsTable log={log} />
        </div>

        {correlatedLogs.length > 1 && (
          <div className="correlated-logs-panel detail-panel">
            <h4 className="small-heading">Correlated Logs</h4>
            <UidTimeline
              currentLog={log}
              logs={correlatedLogs}
              viewLogDetail={viewLogDetail}
            />
          </div>
        )}

        {ConnVersation.shouldShow(log) && (
          <div className="conn-versation-panel detail-panel">
            <ConnVersation log={log} />
          </div>
        )}

        <div className="detail-panel">
          <h4 className="small-heading">Hash Correlations</h4>
          <XHashCorrelation log={log} />
        </div>
      </div>
    )
  }
}
