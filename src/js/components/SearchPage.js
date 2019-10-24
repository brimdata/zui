/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {ipcRenderer} from "electron"

import type {Cluster} from "../state/clusters/types"
import {LeftPane} from "./LeftPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import {XSearchInspector} from "./SearchInspector"
import {XSearchResults} from "./SearchResults/SearchResults"
import {XStatusBar} from "./StatusBar"
import {getCurrentFinding} from "../state/reducers/investigation"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getShowLogsTab} from "../state/reducers/view"
import {initSpace} from "../space/thunks"
import {killAllSearches} from "../searches/cancelSearch"
import {useResizeObserver} from "../hooks/useResizeObserver"
import BackendErrorNotice from "./BackendErrorNotice"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import EmptySpaceModal from "./EmptySpaceModal"
import MainHistogramChart from "../charts/MainHistogram/Chart"
import SettingsModal from "./SettingsModal"
import TitleBar from "./TitleBar"
import WhoisModal from "./WhoisModal"

type Props = {|cluster: Cluster|}

export default function SearchPage({cluster}: Props) {
  let logsTab = useSelector(getShowLogsTab)
  let finding = useSelector(getCurrentFinding)
  let renderKey = finding && finding.ts.getTime().toString()
  let results = useResizeObserver()
  let dispatch = useDispatch()
  let spaceName = useSelector(getCurrentSpaceName)

  useEffect(() => {
    ipcRenderer.send("open-search-window")
    return () => dispatch(killAllSearches())
  }, [])

  useEffect(() => {
    dispatch(initSpace(spaceName))
  }, [cluster])

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <div className="search-page-header">
            <TitleBar />
            <ControlBar />
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
      <BackendErrorNotice />
      <XSearchInspector />
      <XDownloadProgress />
      <WhoisModal />
      <SettingsModal />
      <EmptySpaceModal />
    </div>
  )
}
