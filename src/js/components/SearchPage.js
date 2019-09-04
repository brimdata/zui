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
import {XSettingsModal} from "./SettingsModal"
import {XStatusBar} from "./StatusBar"
import {XWhoisModal} from "./WhoisModal"
import {getCurrentFinding} from "../state/reducers/investigation"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getShowLogsTab} from "../state/reducers/view"
import {initSpace} from "../space/thunks"
import {killAllSearches} from "../searches/cancelSearch"
import {useResizeObserver} from "../hooks/useResizeObserver"
import BackendErrorNotice from "./BackendErrorNotice"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import DragIngest from "./DragIngest"
import MainHistogramChart from "../charts/MainHistogram/Chart"
import TitleBar from "./TitleBar"

type Props = {|cluster: Cluster|}

export default function SearchPage({cluster}: Props) {
  let logsTab = useSelector(getShowLogsTab)
  let finding = useSelector(getCurrentFinding)
  let renderKey = finding && finding.ts.getTime().toString()
  let results = useResizeObserver()
  let dispatch = useDispatch()
  let spaceName = useSelector(getCurrentSpaceName)

  useEffect(() => {
    ipcRenderer.send("page:search:mount")
    return () => {
      ipcRenderer.send("page:search:unmount")
      dispatch(killAllSearches())
    }
  }, [])

  useEffect(() => {
    dispatch(initSpace(spaceName))
  }, [cluster])

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <TitleBar />
          <div className="search-page-header">
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
      <XWhoisModal />
      <XSettingsModal />
      <DragIngest />
    </div>
  )
}
