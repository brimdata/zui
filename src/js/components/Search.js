import React from "react"
import {Redirect} from "react-router-dom"

import XTitleBar from "../connectors/XTitleBar"
import XControlBar from "../connectors/XControlBar"
import XLogViewer from "../connectors/XLogViewer"
import XSearchStats from "../connectors/XSearchStats"
import XCountByTime from "../connectors/XCountByTime"
import XFilterTree from "../connectors/XFilterTree"
import XLogDetail from "../connectors/XLogDetail"

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
        <div className="search-page-header">
          <XTitleBar />
          <XControlBar />
          <XCountByTime />
        </div>
        <div className="search-page-body">
          <div className="search-page-sidebar-left">
            <XFilterTree />
          </div>
          <div className="search-page-main">
            <XLogViewer />
          </div>
          <div className="search-page-sidebar-right">
            <XLogDetail />
          </div>
        </div>
        <div className="search-page-footer">
          <XSearchStats />
        </div>
      </div>
    )
  }
}
