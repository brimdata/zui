import React from "react"
import FieldsTable from "./FieldsTable"
import UidTimeline from "./UidTimeline"
import ConnVersation from "./ConnVersation"

export default class LogDetail extends React.Component {
  render() {
    const {log, correlatedLogs, viewLogDetail} = this.props
    if (!log)
      return (
        <div className="empty-message-wrapper">
          <div className="empty-message">
            <h3>No Log Selected</h3>
            <p>Click the timestamp of a log to view details.</p>
            <p>
              Toggle this pane with <code>Cmd + ]</code>.
            </p>
          </div>
        </div>
      )

    return (
      <div className="log-detail" ref={r => (this.el = r)}>
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
