/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"
import CloseButton from "./CloseButton"
import {Header} from "./Typography"

type Props = {|
  title: string,
  children: *,
  style: Object
|}

export default class MessageBox extends React.Component<Props> {
  render() {
    return ReactDOM.createPortal(
      <div className="message-box" style={this.props.style}>
        <Header>{this.props.title}</Header>
        {this.props.children}
        <CloseButton />
      </div>,
      Doc.id("notification-root")
    )
  }
}
