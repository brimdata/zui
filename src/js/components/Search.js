import React from "react"
import {Redirect} from "react-router-dom"
import {AutoSizer} from "react-virtualized"

import XTitleBar from "../connectors/XTitleBar"
import XControlBar from "../connectors/XControlBar"
import XLogViewer from "../connectors/XLogViewer"
import XSearchStats from "../connectors/XSearchStats"
import XCountByTime from "../connectors/XCountByTime"
import XHistoryAside from "../connectors/XHistoryAside"
import XLogDetail from "../connectors/XLogDetail"
import XSearchWelcome from "../connectors/XSearchWelcome"
import XAnalysisViewer from "../connectors/XAnalysisViewer"
import DragAnchor from "./DragAnchor"

export default class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {rightWidth: 100, leftWidth: 100}
    this.onDragRight = this.onDragRight.bind(this)
    this.onDragLeft = this.onDragLeft.bind(this)
  }

  componentDidMount() {
    this.props.fetchAllSpaces()
  }

  onDragRight(e) {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth - this.state.leftWidth
    this.setState({rightWidth: Math.min(width, max)})
  }

  onDragLeft(e) {
    const width = e.clientX
    const max = window.innerWidth - this.state.rightWidth
    this.setState({leftWidth: Math.min(width, max)})
  }

  render() {
    const {
      isConnected,
      currentSpaceName,
      leftSidebarIsOpen,
      rightSidebarIsOpen,
      initialLoad,
      showLogsTab,
      showAnalyticsTab
    } = this.props

    if (!isConnected) return <Redirect to="/connect" />
    if (!currentSpaceName) return <Redirect to="/spaces" />
    return (
      <div className="search-page">
        <XTitleBar />

        <div className="search-page-window">
          {leftSidebarIsOpen && (
            <div className="pane">
              <div
                className="search-page-sidebar-left"
                style={{width: this.state.leftWidth}}
              >
                <XHistoryAside />
              </div>
              <DragAnchor onDrag={this.onDragLeft} position="right" />
            </div>
          )}
          <div className="search-page-main">
            <div className="search-page-header">
              <XControlBar />
              {!initialLoad &&
                showLogsTab && (
                  <div className="search-page-header-charts">
                    <AutoSizer disableHeight>
                      {({width}) => <XCountByTime height={80} width={width} />}
                    </AutoSizer>
                  </div>
                )}
            </div>

            <div className="search-page-body">
              {initialLoad && (
                <XSearchWelcome currentSpaceName={currentSpaceName} />
              )}
              {!initialLoad && (
                <div className="search-page-results">
                  {showLogsTab && <XLogViewer />}
                  {showAnalyticsTab && <XAnalysisViewer />}
                </div>
              )}
              {rightSidebarIsOpen && (
                <div className="pane">
                  <div
                    className="search-page-sidebar-right"
                    style={{width: this.state.rightWidth}}
                  >
                    <DragAnchor onDrag={this.onDragRight} position="left" />
                    <XLogDetail />
                  </div>
                </div>
              )}
            </div>

            <div className="search-page-footer">
              <XSearchStats />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
