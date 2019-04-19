/* @flow */

import {connect} from "react-redux"
import React from "react"

import {Md5Panel} from "./Md5Panel"
import type {Search} from "../../state/searches/types"
import type {State} from "../../state/reducers/types"
import {buildLogDetail, getIsGoingBack} from "../../state/selectors/logDetails"
import {getLogCorrelations} from "../../state/selectors/correlations"
import {getSearchesByTag} from "../../state/searches/selector"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import Log from "../../models/Log"
import NavAnimation from "./NavAnimation"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"

type Props = {|
  log: ?Log,
  isGoingBack: boolean,
  searches: Search[]
|}

export type PanelProps = {|
  searches: Search[],
  log: Log
|}

export default class LogDetails extends React.Component<Props> {
  render() {
    const {log, searches, isGoingBack} = this.props
    if (!log) return <NoSelection />

    const panelProps = {log, searches}

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

function stateToProps(state: State) {
  return {
    log: buildLogDetail(state),
    isGoingBack: getIsGoingBack(state),
    searches: getSearchesByTag(state, "detail")
  }
}

export const XLogDetails = connect<Props, {||}, _, _, _, _>(stateToProps)(
  LogDetails
)
