import React from "react"
import FieldsTable from "./FieldsTable"
import UidTimeline from "./UidTimeline"
import ConnVersation from "./ConnVersation"

export default class LogDetail extends React.Component {
  render() {
    const {log, correlatedLogs} = this.props
    if (!log)
      return (
        <div className="log-detail">
          <div className="empty-message">
            <p>No Log Selected</p>
            <p>Click the timestamp of a log to view details.</p>
          </div>
        </div>
      )

    return (
      <div className="log-detail">
        <div className="log-detail-body">
          <div className="correlated-logs-panel">
            <h4 className="small-heading">Correlated Logs</h4>
            <UidTimeline currentLog={log} logs={correlatedLogs} />
          </div>

          <div className="conn-versation-panel">
            <ConnVersation log={log} />
          </div>

          <div className="fields-table-panel">
            <h4 className="small-heading">Fields</h4>
            <FieldsTable log={log} />
          </div>
        </div>
      </div>
    )
  }
}
