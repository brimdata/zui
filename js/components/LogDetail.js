import React from "react"
import FieldsTable from "./FieldsTable"
import UidTimeline from "./UidTimeline"
import ConnVersation from "./ConnVersation"
import X from "../icons/x-md.svg"

export default class LogDetail extends React.Component {
  render() {
    const {log, correlatedLogs} = this.props
    if (!log) return null

    return (
      <div className="log-detail">
        <header className="log-detail-header">
          <p className="small-heading">Details</p>
          <div className="close-button" onClick={this.props.close}>
            <X />
          </div>
        </header>
        <div className="log-detail-body">
          <div className="correlated-logs-panel">
            <h4 className="panel-heading">Correlated Logs</h4>
            <UidTimeline currentLog={log} logs={correlatedLogs} />
          </div>

          <div className="conn-versation-panel">
            <ConnVersation log={log} />
          </div>

          <div className="fields-table-panel">
            <h4 className="panel-heading">Fields</h4>
            <FieldsTable log={log} />
          </div>
        </div>
      </div>
    )
  }
}
