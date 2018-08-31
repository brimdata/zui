import React from "react"
import FieldsTable from "./FieldsTable"
import UidTimeline from "./UidTimeline"
import ConnVersation from "./ConnVersation"
import Star from "../icons/star-sm.svg"
import Back from "../icons/back-arrow.svg"
import Forward from "../icons/forward-arrow.svg"

export default class LogDetail extends React.Component {
  render() {
    const {
      log,
      correlatedLogs,
      backLogDetail,
      forwardLogDetail,
      prevExists,
      nextExists,
      viewLogDetail
    } = this.props
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
        <header>
          <div className="history-buttons">
            <button
              className="panel-button back-button"
              disabled={!prevExists}
              onClick={backLogDetail}
            >
              <Back />
            </button>
            <button
              className="panel-button forward-button"
              onClick={forwardLogDetail}
              disabled={!nextExists}
            >
              <Forward />
            </button>
          </div>
          <h4 className="medium-heading">Log Details</h4>
          <button className="panel-button star-button">
            <Star />
          </button>
        </header>
        <div className="log-detail-body">
          <div className="correlated-logs-panel">
            <h4 className="small-heading">Correlated Logs</h4>
            <UidTimeline currentLog={log} logs={correlatedLogs} viewLogDetail={viewLogDetail} />
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
