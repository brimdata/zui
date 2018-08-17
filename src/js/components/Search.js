import React from "react"
import {Redirect} from "react-router-dom"

import XTitleBar from "../connectors/XTitleBar"
import XControlBar from "../connectors/XControlBar"
import XLogViewer from "../connectors/XLogViewer"
import XSearchStats from "../connectors/XSearchStats"
import XCountByTime from "../connectors/XCountByTime"
import XFilterTree from "../connectors/XFilterTree"
import XLogDetail from "../connectors/XLogDetail"
import XSearchWelcome from "../connectors/XSearchWelcome"

export default class Search extends React.Component {
  componentDidMount() {
    this.props.fetchAllSpaces()
  }

  render() {
    const {
      isConnected,
      currentSpaceName,
      leftSidebarIsOpen,
      rightSidebarIsOpen,
      initialLoad
    } = this.props

    if (!isConnected) return <Redirect to="/connect" />
    if (!currentSpaceName) return <Redirect to="/spaces" />

    return (
      <div className="search-page">
        <XTitleBar />

        <div className="search-page-window">
          {leftSidebarIsOpen && (
            <div className="search-page-sidebar-left">
              <XFilterTree />
            </div>
          )}
          <div className="search-page-main">
            <div className="search-page-header">
              <XControlBar />
              {!initialLoad && <XCountByTime />}
            </div>

            <div className="search-page-body">
              {initialLoad && (
                <XSearchWelcome currentSpaceName={currentSpaceName} />
              )}
              {!initialLoad && (
                <div className="search-page-results">
                  <XLogViewer />
                </div>
              )}
              {rightSidebarIsOpen && (
                <div className="search-page-sidebar-right">
                  <XLogDetail />
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

// <div className="search-page-main">

//       <XControlBar />
//       <XCountByTime />
//     </div>
//     <div className="search-page-body">
//       <XLogViewer />
//       {rightSidebarIsOpen && (
//         <div className="search-page-sidebar-right">
//           <XLogDetail />
//         </div>
//       )}
//     </div>

//   </div>
