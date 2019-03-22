/* @flow */

import {TransitionGroup, CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import {type State} from "../reducers/types"
import {buildLogDetail, getIsGoingBack} from "../selectors/logDetails"
import {getLogCorrelations} from "../selectors/correlations"
import EmptyLogDetail from "./EmptyLogDetail"
import Log from "../models/Log"
import LogDetail from "./LogDetail"

type Props = {|
  log: ?Log,
  isGoingBack: boolean,
  correlations: {[string]: Log[]}
|}

export default class LogDetailPane extends React.Component<Props> {
  render() {
    const {log, isGoingBack, correlations} = this.props

    if (!log) return <EmptyLogDetail />

    return (
      <TransitionGroup
        className={classNames("log-detail-wrapper", {
          prev: isGoingBack
        })}
      >
        <CSSTransition
          key={log.id()}
          classNames="log-detail"
          timeout={{
            enter: 250,
            exit: 250
          }}
        >
          <LogDetail log={log} relatedLogs={correlations} />
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

const stateToProps = (state: State) => ({
  log: buildLogDetail(state),
  correlations: getLogCorrelations(state),
  isGoingBack: getIsGoingBack(state)
})

export const XLogDetailPane = connect<Props, {||}, _, _, _, _>(stateToProps)(
  LogDetailPane
)
