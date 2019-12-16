/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {ipcRenderer} from "electron"

import type {Cluster} from "../state/clusters/types"
import {DebugModal} from "./DebugModal"
import {LeftPane} from "./LeftPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import {XSearchResults} from "./SearchResults/SearchResults"
import {XStatusBar} from "./StatusBar"
import {checkVersions} from "../services/boom"
import {getCurrentFinding} from "../state/reducers/investigation"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getKey} from "../lib/finding"
import {getSearchProgram} from "../state/selectors/searchBar"
import {hasAnalytics} from "../lib/Program"
import {initSpace} from "../flows/space/thunks"
import {useResizeObserver} from "./hooks/useResizeObserver"
import BoomGetModal from "./BoomGetModal"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import ErrorNotice from "./ErrorNotice"
import MainHistogramChart from "./charts/MainHistogram/Chart"
import SearchInspector from "./SearchInspector"
import SettingsModal from "./SettingsModal"
import WhoisModal from "./WhoisModal"
import handlers from "../state/handlers"

type Props = {|cluster: Cluster|}

export default function SearchPage({cluster}: Props) {
  let logsTab = !hasAnalytics(useSelector(getSearchProgram))
  let finding = useSelector(getCurrentFinding)
  let renderKey = finding && getKey(finding)
  let results = useResizeObserver()
  let dispatch = useDispatch()
  let spaceName = useSelector(getCurrentSpaceName)

  useEffect(() => {
    ipcRenderer.send("open-search-window")
    setTimeout(() => dispatch(checkVersions()), 500)
    return () => dispatch(handlers.abortAll())
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
      <SearchInspector />
      <XDownloadProgress />
      <WhoisModal />
      <DebugModal />
      <CurlModal />
      <SettingsModal />
      <EmptySpaceModal />
      <BoomGetModal />
    </div>
  )
}
