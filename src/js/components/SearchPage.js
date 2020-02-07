/* @flow */

import {useDispatch} from "react-redux"
import React, {useEffect} from "react"

import {ipcRenderer} from "electron"

import {DebugModal} from "./DebugModal"
import {LeftPane} from "./LeftPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import {XSearchResults} from "./SearchResults/SearchResults"
import {XStatusBar} from "./StatusBar"
import {checkVersions} from "../services/boom"
import {initSpace} from "../flows/initSpace"
import {useResizeObserver} from "./hooks/useResizeObserver"
import BoomGetModal from "./BoomGetModal"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import ErrorNotice from "./ErrorNotice"
import Handlers from "../state/Handlers"
import SearchHeaderChart from "./SearchHeaderChart"
import SettingsModal from "./SettingsModal"
import TabBar from "./TabBar/TabBar"
import WhoisModal from "./WhoisModal"
import useSearchShortcuts from "./useSearchShortcuts"

export default function SearchPage() {
  let results = useResizeObserver()
  let dispatch = useDispatch()
  useSearchShortcuts()

  useEffect(() => {
    ipcRenderer.send("open-search-window")
    dispatch(initSpace("default"))
    setTimeout(() => dispatch(checkVersions()), 500)
    return () => dispatch(Handlers.abortAll())
  }, [])

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <div className="search-page-header">
            <TabBar />
            <ControlBar />
            <SearchHeaderChart />
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
