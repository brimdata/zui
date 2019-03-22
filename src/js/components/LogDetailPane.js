/* @flow */

import {TransitionGroup, CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import {type State} from "../reducers/types"
import {XLogDetail} from "./LogDetail"
import EmptyLogDetail from "./EmptyLogDetail"
import Log from "../models/Log"
import * as selector from "../selectors/logDetails"

type Props = {|
  log: ?Log,
  isGoingBack: boolean
|}

export default class LogDetailPane extends React.Component<Props> {
  render() {
    const {log, isGoingBack} = this.props

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
          <XLogDetail log={log} />
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

const stateToProps = (state: State) => ({
  log: selector.buildLogDetail(state),
  isGoingBack: selector.getIsGoingBack(state)
})

export const XLogDetailPane = connect<Props, {||}, _, _, _, _>(stateToProps)(
  LogDetailPane
)
