/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {State} from "../../reducers/types"
import {buildLogDetail, getIsGoingBack} from "../../selectors/logDetails"
import {getLogCorrelations} from "../../selectors/correlations"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import Log from "../../models/Log"
import Md5Panel from "./Md5Panel"
import NavAnimation from "./NavAnimation"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"

type Props = {|
  log: ?Log,
  isGoingBack: boolean,
  relatedLogs: {[string]: Log[]}
|}

export default class LogDetails extends React.Component<Props> {
  render() {
    const {log, relatedLogs, isGoingBack} = this.props
    if (!log) return <NoSelection />

    const panelProps = {log, relatedLogs}
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
  isGoingBack: getIsGoingBack(state)
})

export const XLogDetails = connect<Props, {||}, _, _, _, _>(stateToProps)(
  LogDetails
)
