/* @flow */

import {CSSTransition, TransitionGroup} from "react-transition-group"
import {connect} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import type {State, Dispatch} from "../state/reducers/types"
import {getNotifications} from "../state/selectors/notifications"
import {removeNotification} from "../state/actions"
import AppError from "../models/AppError"
import * as Doc from "../lib/Doc"
import ErrorTemplate from "./ErrorTemplate"
import dispatchToProps from "../lib/dispatchToProps"

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
