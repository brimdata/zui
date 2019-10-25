/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {DispatchProps} from "../state/types"
import {reactElementProps} from "../test/integration"
import {submitSearchBar} from "../state/thunks/searchBar"
import MagGlass from "../icons/magnifying-glass-md.svg"
import dispatchToProps from "../lib/dispatchToProps"

type StateProps = {|
  debugModalIsOpen: boolean,
  curlModalIsOpen: boolean
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

export default class SearchButton extends React.Component<Props> {
  render() {
    return (
      <div className="search-button-wrapper">
        <button
          className="button search-button"
          {...reactElementProps("search_button")}
          onClick={() => this.props.dispatch(submitSearchBar())}
        >
          <MagGlass />
        </button>
      </div>
    )
  }
}

export const XSearchButton = connect<Props, {||}, _, _, _, _>(
  null,
  dispatchToProps
)(SearchButton)
