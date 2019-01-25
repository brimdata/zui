/* @flow */

import React from "react"
import Log from "../models/Log"
import {TransitionGroup, CSSTransition} from "react-transition-group"
import EmptyLogDetail from "./EmptyLogDetail"
import LogDetail from "./LogDetail"
import classNames from "classnames"
import {connect} from "react-redux"
import * as selector from "../selectors/logDetails"
import dispatchToProps from "../lib/dispatchToProps"
import {type DispatchProps} from "../reducers/types"
import {type State} from "../reducers/types"
import {viewLogDetail} from "../actions/logDetails"

type StateProps = {|
  log: ?Log,
  correlatedLogs: Log[],
  isGoingBack: boolean
|}

type Props = {|...StateProps, ...DispatchProps|}

export default class LogDetailPane extends React.Component<Props> {
  render() {
    const {log, correlatedLogs, isGoingBack} = this.props

    if (!log) return <EmptyLogDetail />

    return (
      <TransitionGroup
        className={classNames("log-detail-wrapper", {
          prev: isGoingBack
        })}
      >
        <CSSTransition
          key={log.tuple.join("")}
          classNames="log-detail"
          timeout={{
            enter: 250,
            exit: 250
          }}
        >
          <LogDetail
            log={log}
            correlatedLogs={correlatedLogs}
            viewLogDetail={log => this.props.dispatch(viewLogDetail(log))}
          />
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

const stateToProps = (state: State) => ({
  log: selector.buildLogDetail(state),
  correlatedLogs: selector.buildCorrelatedLogs(state),
  isGoingBack: selector.getIsGoingBack(state)
})

export const XLogDetailPane = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(LogDetailPane)
