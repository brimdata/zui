import React from "react"
import XTimeWindowInput from "../connectors/XTimeWindowInput"
import XSearchInput from "../connectors/XSearchInput"
import XSearchButton from "../connectors/XSearchButton"
import XPins from "../connectors/XPins"

export default class SearchBar extends React.Component {
  render() {
    return (
      <div className="search-bar">
        <div className="search-builder">
          <div className="search-inputs">
            <XSearchInput />
            <XTimeWindowInput />
          </div>
          <XPins />
        </div>

        <XSearchButton />
      </div>
    )
  }
}
