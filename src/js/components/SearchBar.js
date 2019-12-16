/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {State} from "../state/types"
import {XPins} from "./Pins"
import {getSearchBarError} from "../state/selectors/searchBar"
import SearchInput from "./SearchInput"
import Warning from "./icons/warning-sm.svg"

type StateProps = {|
  error: ?string
|}

type Props = {|...StateProps|}

export default class SearchBar extends React.Component<Props> {
  render() {
    return (
      <div className="search-bar">
        <div className="search-builder">
          <div className="search-inputs">
            <SearchInput />
          </div>
          {this.props.error && <ErrorMessage error={this.props.error} />}
          <XPins />
        </div>
      </div>
    )
  }
}

const ErrorMessage = ({error}) => (
  <div className="error-message">
    <div className="warning-icon">
      <Warning />
    </div>
    <span>{error}</span>
  </div>
)

const stateToProps = (state: State) => ({
  error: getSearchBarError(state)
})

export const XSearchBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  SearchBar
)
