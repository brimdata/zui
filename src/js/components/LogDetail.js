/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {State} from "../reducers/types"
import {XUidTimeline} from "./UidTimeline"
import {buildCorrelatedLogs} from "../selectors/logDetails"
import ConnVersation from "./ConnVersation"
import FieldsTable from "./FieldsTable"
import Log from "../models/Log"

type OwnProps = {|
  log: Log
|}

type Props = {|
  ...OwnProps,
  uidCorrelation: Log[]
|}

export default class LogDetail extends React.Component<Props> {
  el: ?HTMLElement

  render() {
    const {log} = this.props

    return (
      <div className="log-detail">
        <div className="fields-table-panel detail-panel">
          <h4 className="small-heading">Fields</h4>
          <FieldsTable log={log} />
        </div>

        {this.props.uidCorrelation.length > 1 && (
          <div className="correlated-logs-panel detail-panel">
            <h4 className="small-heading">Correlated Logs</h4>
            <XUidTimeline log={log} logs={this.props.uidCorrelation} />
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

const stateToProps = (state: State) => ({
  uidCorrelation: buildCorrelatedLogs(state)
})

export const XLogDetail = connect<Props, OwnProps, _, _, _, _>(stateToProps)(
  LogDetail
)
