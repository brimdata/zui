/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {ipcRenderer} from "electron"

import {DebugModal} from "./DebugModal"
import {LeftPane} from "./LeftPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import {XSearchResults} from "./SearchResults/SearchResults"
import {XStatusBar} from "./StatusBar"
import {checkVersions} from "../services/boom"
import {getCurrentFinding} from "../state/reducers/investigation"
import {getKey} from "../lib/finding"
import {getSearchProgram} from "../state/selectors/searchBar"
import {hasAnalytics} from "../lib/Program"
import {initSpace} from "../flows/initSpace"
import {useResizeObserver} from "./hooks/useResizeObserver"
import BoomGetModal from "./BoomGetModal"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import ErrorNotice from "./ErrorNotice"
import MainHistogramChart from "./charts/MainHistogram/Chart"
import SettingsModal from "./SettingsModal"
import TabBar from "./TabBar"
import WhoisModal from "./WhoisModal"
import handlers from "../state/handlers"

export default function SearchPage() {
  let logsTab = !hasAnalytics(useSelector(getSearchProgram))
  let finding = useSelector(getCurrentFinding)
  let renderKey = finding && getKey(finding)
  let results = useResizeObserver()
  let dispatch = useDispatch()

  useEffect(() => {
    ipcRenderer.send("open-search-window")
    dispatch(initSpace("default"))
    setTimeout(() => dispatch(checkVersions()), 500)
    return () => dispatch(handlers.abortAll())
  }, [])

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <div className="search-page-header">
            <TabBar />
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
