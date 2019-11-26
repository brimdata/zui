/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {ipcRenderer} from "electron"

import type {Cluster} from "../state/clusters/types"
import {DebugModal} from "./DebugModal"
import {LeftPane} from "./LeftPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import {XSearchInspector} from "./SearchInspector"
import {XSearchResults} from "./SearchResults/SearchResults"
import {XStatusBar} from "./StatusBar"
import {getCurrentFinding} from "../state/reducers/investigation"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getKey} from "../lib/finding"
import {getShowLogsTab} from "../state/reducers/view"
import {initSpace} from "../space/thunks"
import {killAllSearches} from "../searches/cancelSearch"
import {useResizeObserver} from "../hooks/useResizeObserver"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import ErrorNotice from "./ErrorNotice"
import MainHistogramChart from "../charts/MainHistogram/Chart"
import SettingsModal from "./SettingsModal"
import WhoisModal from "./WhoisModal"

type Props = {|cluster: Cluster|}

export default function SearchPage({cluster}: Props) {
  let logsTab = useSelector(getShowLogsTab)
  let finding = useSelector(getCurrentFinding)
  let renderKey = finding && getKey(finding)
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
      <ErrorNotice />
      <XSearchInspector />
      <XDownloadProgress />
      <WhoisModal />
      <DebugModal />
      <CurlModal />
      <SettingsModal />
      <EmptySpaceModal />
    </div>
  )
}
