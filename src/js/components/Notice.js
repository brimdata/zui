/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import X from "../icons/x-md.svg"
import {CSSTransition} from "react-transition-group"
import * as Doc from "../lib/Doc"

type Props = {message: string, dismissNotice: Function}

export default class Notice extends React.Component<Props> {
  timeout: ?TimeoutID
  dismiss: Function

  constructor(props: Props) {
    super(props)
    this.timeout = null

    this.dismiss = () => {
      if (this.timeout) clearTimeout(this.timeout)
      this.props.dismissNotice()
    }
  }

  dismiss() {
    this.props.dismissNotice
  }

  render() {
    if (this.props.message) {
      this.timeout = setTimeout(this.props.dismissNotice, 6000)
    }

    return ReactDOM.createPortal(
      <CSSTransition
        timeout={300}
        in={!!this.props.message}
        unmountOnExit
        mountOnEnter
        classNames="notice"
      >
        <div className="notice">
          <p>{this.props.message}</p>
          <button className="close-button" onClick={this.dismiss}>
            <X />
          </button>
        </div>
      </CSSTransition>,
      Doc.id("notification-root")
    )
  }
}
