/* @flow */

import {connect} from "react-redux"
import React from "react"

import {Md5Panel} from "./Md5Panel"
import type {State} from "../../reducers/types"
import {buildLogDetail, getIsGoingBack} from "../../selectors/logDetails"
import {getDetailStatuses} from "../../selectors/boomSearches"
import {getLogCorrelations} from "../../selectors/correlations"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import Log from "../../models/Log"
import NavAnimation from "./NavAnimation"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"

type Props = {|
  log: ?Log,
  isGoingBack: boolean,
  relatedLogs: {[string]: Log[]},
  statuses: {[string]: string}
|}

export type PanelProps = {|
  relatedLogs: {[string]: Log[]},
  statuses: {[string]: string},
  log: Log
|}

export default class LogDetails extends React.Component<Props> {
  render() {
    const {log, relatedLogs, isGoingBack, statuses} = this.props
    if (!log) return <NoSelection />

    const panelProps = {log, relatedLogs, statuses}

    return (
      <NavAnimation log={log} prev={isGoingBack}>
        <div className="log-detail">
          <FieldsPanel {...panelProps} />
          <UidPanel {...panelProps} />
          <ConnPanel {...panelProps} />
          <Md5Panel {...panelProps} />
        </div>
      </NavAnimation>
    )
  }
}

const stateToProps = (state: State) => ({
  log: buildLogDetail(state),
  relatedLogs: getLogCorrelations(state),
  isGoingBack: getIsGoingBack(state),
  statuses: getDetailStatuses(state)
})

export const XLogDetails = connect<Props, {||}, _, _, _, _>(stateToProps)(
  LogDetails
)
