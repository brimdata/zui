/* @flow */

import React from "react"
import MenuList from "./MenuList"
import {connect} from "react-redux"
import {showModal} from "../actions/view"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {dispatch: Function}

export default class SearchButtonMenu extends React.Component<Props> {
  render() {
    return (
      <MenuList>
        <li onClick={() => this.props.dispatch(showModal("debug"))}>
          Debug query
        </li>
        <li onClick={() => this.props.dispatch(showModal("curl"))}>
          Copy for curl
        </li>
      </MenuList>
    )
  }
}

export const XSearchButtonMenu = connect<Props, {||}, _, _, _, _>(
  null,
  dispatchToProps
)(SearchButtonMenu)
