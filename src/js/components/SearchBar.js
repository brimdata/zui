import React from "react"
import XSearchInput from "../connectors/XSearchInput"
import {XSearchButton} from "../components/SearchButton"
import XPins from "../connectors/XPins"
import Warning from "../icons/warning-sm.svg"

export default class SearchBar extends React.Component {
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
