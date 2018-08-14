import React from "react"
import XSearchBar from "../connectors/XSearchBar"

export default class ControlBar extends React.Component {
  render() {
    return (
      <div className="control-bar">
        <XSearchBar />
      </div>
    )
  }
}
