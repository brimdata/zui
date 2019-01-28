/* @flow */

import React from "react"
import {connect} from "react-redux"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"
import {CSSTransition, TransitionGroup} from "react-transition-group"
import {type ErrorMessage} from "../types"
import errorMessageFactory from "./ErrorMessageFactory"

type Props = {messages: ErrorMessage[]}

export default class Notifications extends React.Component<Props> {
  removeMessage(_index: number) {
    // Dispatch to the reducer
  }

  renderErrorMessage = (message: ErrorMessage, index: number) => {
    const Class = errorMessageFactory(message)
    return <Class {...message} onClose={() => this.removeMessage(index)} />
  }

  render() {
    return ReactDOM.createPortal(
      <TransitionGroup className="notifications">
        {this.props.messages.map((message, i) => (
          <CSSTransition
            key={message.key}
            classNames="notification"
            timeout={{enter: 200, exit: 200}}
          >
            {this.renderErrorMessage(message, i)}
          </CSSTransition>
        ))}
      </TransitionGroup>,
      Doc.id("notification-root")
    )
  }
}

const stateToProps = () => ({
  messages: []
})

export const XNotifications = connect<Props, {||}, _, _, _, _>(stateToProps)(
  Notifications
)
