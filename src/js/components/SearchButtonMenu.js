/* @flow */

import React from "react"
import MenuList from "./MenuList"
import {connect} from "react-redux"
import {showModal} from "../actions/view"

type Props = {dispatch: Function}

export default class SearchButtonMenu extends React.Component<Props> {
  render() {
    return (
      <MenuList>
        <li onClick={() => {}}>Save query (coming soon)</li>
        <li onClick={() => {}}>Load query (coming soon)</li>
        <li onClick={() => this.props.dispatch(showModal("debug"))}>
          Debug query
        </li>
        <li onClick={() => this.props.dispatch(showModal("curl"))}>
          Copy for curl
        </li>
        <li onClick={() => {}}>Copy for CLI (coming soon)</li>
      </MenuList>
    )
  }
}

export const XSearchButtonMenu = connect()(SearchButtonMenu)
