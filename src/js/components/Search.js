import React from "react"
import {Redirect} from "react-router-dom"

import XTitleBar from "../connectors/XTitleBar"
import XControlBar from "../connectors/XControlBar"
import XLogViewer from "../connectors/XLogViewer"
import XSearchStats from "../connectors/XSearchStats"

export default class Search extends React.Component {
  componentDidMount() {
    this.props.fetchAllSpaces()
  }

  render() {
    const {isConnected, currentSpaceName} = this.props
    if (!isConnected) return <Redirect to="/connect" />
    if (!currentSpaceName) return <Redirect to="/spaces" />

    return (
      <div className="search-page">
        <XTitleBar />
        <XControlBar />
        <div className="search-page-body">
          <XLogViewer />
        </div>
        <div className="search-page-footer">
          <XSearchStats />
        </div>
      </div>
    )
  }
}
