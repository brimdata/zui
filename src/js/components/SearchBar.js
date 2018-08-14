import React from "react"
import XTimeWindowInput from "../connectors/XTimeWindowInput"
import XSearchInput from "../connectors/XSearchInput"
import XSearchButton from "../connectors/XSearchButton"
import XPins from "../connectors/XPins"

export default class SearchBar extends React.Component {
  render() {
    return (
      <div className="search-bar">
        <img
          src="dist/static/looky-face.png"
          width="34"
          height="34"
          className="looky-face"
        />

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
