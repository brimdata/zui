/* @flow */

import React from "react"
import {XSearchInput} from "./SearchInput"
import {XSearchButton} from "../components/SearchButton"
import {XPins} from "./Pins"
import Warning from "../icons/warning-sm.svg"
import {connect} from "react-redux"
import {getSearchBarError} from "../selectors/searchBar"
import {type State} from "../reducers/types"

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
            <XSearchInput />
          </div>
          {this.props.error && <ErrorMessage error={this.props.error} />}
          <XPins />
        </div>
        <XSearchButton />
      </div>
    )
  }
}

const ErrorMessage = ({error}) => (
  <div className="error-message">
    <div className="warning-icon">
      <Warning />
    </div>
    <p>{error}</p>
  </div>
)

const stateToProps = (state: State) => ({
  error: getSearchBarError(state)
})

export const XSearchBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  SearchBar
)
