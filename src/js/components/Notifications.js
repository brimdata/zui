/* @flow */

import React from "react"
import {connect} from "react-redux"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"
import {CSSTransition, TransitionGroup} from "react-transition-group"
import AppError from "../models/AppError"
import type {State, Dispatch} from "../reducers/types"
import {getNotifications} from "../selectors/notifications"
import dispatchToProps from "../lib/dispatchToProps"
import {removeNotification} from "../actions/notifications"
import ErrorTemplate from "./ErrorTemplate"

type Props = {messages: AppError[], dispatch: Dispatch}

export default class Notifications extends React.Component<Props> {
  removeMessage(index: number) {
    this.props.dispatch(removeNotification(index))
  }

  render() {
    return ReactDOM.createPortal(
      <TransitionGroup className="notifications">
        {this.props.messages.map((message, index) => (
          <CSSTransition
            key={message.ts.toString()}
            classNames="notification"
            timeout={{enter: 200, exit: 200}}
          >
            <ErrorTemplate
              error={message}
              onClose={() => this.removeMessage(index)}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>,
      Doc.id("notification-root")
    )
  }
}

const stateToProps = (state: State) => ({
  messages: getNotifications(state)
})

export const XNotifications = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Notifications)
