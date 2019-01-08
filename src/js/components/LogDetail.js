/* @flow */

import React from "react"
import FieldsTable from "./FieldsTable"
import UidTimeline from "./UidTimeline"
import ConnVersation from "./ConnVersation"
import Log from "../models/Log"

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
        <div className="fields-table-panel">
          <h4 className="small-heading">Fields</h4>
          <FieldsTable log={log} />
        </div>

        {correlatedLogs.length > 1 && (
          <div className="correlated-logs-panel">
            <h4 className="small-heading">Correlated Logs</h4>
            <UidTimeline
              currentLog={log}
              logs={correlatedLogs}
              viewLogDetail={viewLogDetail}
            />
          </div>
        )}

        {ConnVersation.shouldShow(log) && (
          <div className="conn-versation-panel">
            <ConnVersation log={log} />
          </div>
        )}
      </div>
    )
  }
}
