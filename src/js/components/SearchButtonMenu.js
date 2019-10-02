/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {State} from "../state/types"
import {getSearchesByTag} from "../state/searches/selector"
import {killSearchesByTag} from "../searches/cancelSearch"
import MenuList from "./MenuList"
import dispatchToProps from "../lib/dispatchToProps"
import modal from "../modal"
import {reactElementProps} from "../test/integration"

type Props = {dispatch: Function, isFetching: boolean}

export default class SearchButtonMenu extends React.Component<Props> {
  render() {
    return (
      <MenuList {...reactElementProps("optionsMenu")}>
        {this.props.isFetching && (
          <>
            <li
              onClick={() => {
                this.props.dispatch(killSearchesByTag("viewer"))
              }}
            >
              Kill Search
            </li>
            <hr />
          </>
        )}
        <li onClick={() => this.props.dispatch(modal.show("debug"))}>
          Debug query
        </li>
        <li onClick={() => this.props.dispatch(modal.show("curl"))}>
          Copy for curl
        </li>
      </MenuList>
    )
  }
}

const stateToProps = (state: State) => ({
  isFetching: getSearchesByTag(state, "viewer")
    .map((s) => s.status)
    .some((s) => s === "FETCHING")
})

export const XSearchButtonMenu = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchButtonMenu)
