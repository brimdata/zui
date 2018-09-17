import React from "react"
import FieldsTable from "./FieldsTable"
import UidTimeline from "./UidTimeline"
import ConnVersation from "./ConnVersation"
import Star from "../icons/star-sm.svg"
import Back from "../icons/back-arrow.svg"
import Forward from "../icons/forward-arrow.svg"
import classNames from "classnames"

export default class LogDetail extends React.Component {
  componentDidUpdate() {
    // Do this in a different "React" way
    document.querySelector(".search-page-sidebar-right").scrollTop = 0
  }

  render() {
    const {
      log,
      correlatedLogs,
      backLogDetail,
      forwardLogDetail,
      prevExists,
      nextExists,
      starLog,
      unstarLog,
      isStarred,
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
      <div className="log-detail" ref={r => (this.el = r)}>
        <header>
          <div className="history-buttons">
            <a
              tabIndex={0}
              className="panel-button back-button"
              disabled={!prevExists}
              onClick={backLogDetail}
            >
              <Back />
            </a>
            <button
              className="panel-button forward-button"
              onClick={forwardLogDetail}
              disabled={!nextExists}
            >
              <Forward />
            </button>
          </div>
          <h4 className="medium-heading">Log Details</h4>
          <button
            className={classNames("panel-button", "star-button", {
              starred: isStarred
            })}
            onClick={() =>
              isStarred ? unstarLog(log.tuple) : starLog(log.tuple)
            }
          >
            <Star />
          </button>
        </header>
        <div className="fields-table-panel">
          <h4 className="small-heading">Fields</h4>
          <FieldsTable log={log} />
        </div>

        <div className="log-detail-body">
          {correlatedLogs.length > 0 && (
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
      </div>
    )
  }
}
