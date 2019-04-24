/* @flow */

import React from "react"

import {Header} from "./Typography"
import CloseButton from "./CloseButton"

type Props = {|
  title: string,
  children: *,
  onClose?: () => *
|}

export default class MessageBox extends React.Component<Props> {
  render() {
    return (
      <div className="message-box">
        <Header>{this.props.title}</Header>
        {this.props.children}
        {this.props.onClose && <CloseButton onClick={this.props.onClose} />}
      </div>
    )
  }
}
