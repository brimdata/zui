/* @flow */

import React from "react"
import CloseButton from "./CloseButton"
import {Header} from "./Typography"
import {reactElementProps} from "../test/integration"

type Props = {|
  title: string,
  children: *,
  onClose?: () => *
|}

export default class MessageBox extends React.Component<Props> {
  render() {
    return (
      <div className="message-box">
        <Header {...reactElementProps("notification")}>
          {this.props.title}
        </Header>
        {this.props.children}
        {this.props.onClose && <CloseButton onClick={this.props.onClose} />}
      </div>
    )
  }
}
