/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {LeftPane} from "./LeftPane"
import {XControlBar} from "./ControlBar"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import {XSearchInspector} from "./SearchInspector"
import {XSearchResults} from "./SearchResults/SearchResults"
import {XSettingsModal} from "./SettingsModal"
import {XStatusBar} from "./StatusBar"
import {XWhoisModal} from "./WhoisModal"
import {getCurrentFinding} from "../state/reducers/investigation"
import {getShowLogsTab} from "../state/reducers/view"
import {useResizeObserver} from "../hooks/useResizeObserver"
import ClusterError from "./ClusterError"
import ColumnChooser from "./ColumnChooser"
import MainHistogramChart from "../charts/MainHistogram/Chart"
import TitleBar from "./TitleBar"

export default function SearchPage() {
  let logsTab = useSelector(getShowLogsTab)
  let finding = useSelector(getCurrentFinding)
  let renderKey = finding && finding.ts.getTime().toString()
  let results = useResizeObserver()

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <TitleBar />
          <div className="search-page-header">
            <XControlBar />
            {logsTab && (
              <div className="search-page-header-charts">
                <MainHistogramChart key={renderKey} />
              </div>
            )}
            <ColumnChooser />
          </div>
          <div className="search-results" ref={results.ref}>
            <XSearchResults
              width={results.rect.width}
              height={results.rect.height}
            />
          </div>
          <XStatusBar />
        </div>
        <XRightPane />
      </div>
      <ClusterError />
      <XSearchInspector />
      <XDownloadProgress />
      <XWhoisModal />
      <XSettingsModal />
    </div>
  )
}
