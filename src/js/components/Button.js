/* @flow */

import React from "react"

type Props = {children: *}

export default class Button extends React.Component<Props> {
  render() {
    return <button className="button">{this.props.children}</button>
  }
}
