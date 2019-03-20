/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {State} from "../reducers/types"
import {getSomeAreFetching} from "../selectors/boomSearches"
import {killBoomSearches} from "../actions/boomSearches"
import {showModal} from "../actions/view"
import MenuList from "./MenuList"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {dispatch: Function, isFetching: boolean}

export default class SearchButtonMenu extends React.Component<Props> {
  render() {
    return (
      <MenuList>
        {this.props.isFetching && (
          <>
            <li
              onClick={() => {
                this.props.dispatch(killBoomSearches("viewer"))
              }}
            >
              Kill Search
            </li>
            <hr />
          </>
        )}
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

const stateToProps = (state: State) => ({
  isFetching: getSomeAreFetching(state)
})

export const XSearchButtonMenu = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchButtonMenu)
