/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {DebugModal} from "./DebugModal"
import {LeftPane} from "./LeftPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import ErrorNotice from "./ErrorNotice"
import Handlers from "../state/Handlers"
import NewTabContent from "./NewTabContent"
import Search from "../state/Search"
import SearchHeaderChart from "./SearchHeaderChart"
import SearchResults from "./SearchResults/SearchResults"
import SettingsModal from "./SettingsModal"
import StatusBar from "./StatusBar"
import Tab from "../state/Tab"
import TabBar from "./TabBar/TabBar"
import Tabs from "../state/Tabs"
import WhoisModal from "./WhoisModal"
import ZQModal from "./ZQModal"
import brim from "../brim"
import submitSearch from "../flows/submitSearch"
import useSearchShortcuts from "./useSearchShortcuts"
import AboutModal from "./AboutModal"

export default function SearchPage() {
  let dispatch = useDispatch()
  let space = useSelector(Tab.space)
  let tabId = useSelector(Tabs.getActive)
  let queryable = space && !brim.space(space).empty()
  let firstVisit = !useSelector(Tab.currentEntry)

  useSearchShortcuts()

  useEffect(() => {
    if (queryable && firstVisit) {
      dispatch(Search.setSpanArgs(brim.space(space).everythingSpan()))
      dispatch(submitSearch())
    }
  }, [queryable, firstVisit])

  useEffect(() => {
    return () => dispatch(Handlers.abortAll())
  }, [])

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <TabBar />
          {queryable && (
            <div className="search-page-header">
              <ControlBar />
              <SearchHeaderChart />
              <ColumnChooser />
            </div>
          )}
          {queryable ? (
            <SearchResults key={tabId} />
          ) : (
            <NewTabContent key={tabId} />
          )}
          <StatusBar />
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
      <ZQModal />
      <AboutModal />
    </div>
  )
}
