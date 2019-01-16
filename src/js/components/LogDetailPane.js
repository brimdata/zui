/* @flow */

import React from "react"
import Log from "../models/Log"
import {TransitionGroup, CSSTransition} from "react-transition-group"
import EmptyLogDetail from "./EmptyLogDetail"
import LogDetail from "./LogDetail"
import classNames from "classnames"

type Props = {
  log: Log,
  correlatedLogs: Log[],
  viewLogDetail: Function,
  isGoingBack: boolean
}

export default class LogDetailPane extends React.Component<Props> {
  render() {
    const {log, correlatedLogs, viewLogDetail, isGoingBack} = this.props

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
            viewLogDetail={viewLogDetail}
          />
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as selector from "../selectors/logDetails"
import * as actions from "../actions/logDetails"
import * as starActions from "../actions/starredLogs"

const stateToProps = state => ({
  log: selector.buildLogDetail(state),
  correlatedLogs: selector.buildCorrelatedLogs(state),
  isGoingBack: selector.getIsGoingBack(state)
})

export const XLogDetailPane = connect(
  stateToProps,
  (dispatch: Function) =>
    // $FlowFixMe
    bindActionCreators({...actions, ...starActions}, dispatch)
)(LogDetailPane)
