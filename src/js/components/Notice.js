/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import X from "../icons/x-md.svg"

type Props = {message: string, dismissNotice: Function}

export default class Notice extends React.Component<Props> {
  render() {
    if (!this.props.message) {
      return null
    }
    setTimeout(this.props.dismissNotice, 6000)
    return ReactDOM.createPortal(
      <div className="notice">
        <p>There was a problem with the server</p>
        <button className="close-button" onClick={this.props.dismissNotice}>
          <X />
        </button>
      </div>,
      id("notification-root")
    )
  }
}

const id = (name: string) => {
  const el = document.getElementById(name)
  if (el) return el
  else throw new Error(`Could not find DOM node with id: ${name}`)
}
