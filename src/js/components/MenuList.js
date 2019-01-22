/* @flow */

import React from "react"

type Props = {children: *} // Expected to be <li> tags

export default class MenuList extends React.Component<Props> {
  render() {
    return <ul className="menu-list">{this.props.children}</ul>
  }
}
