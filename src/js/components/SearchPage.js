/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {DebugModal} from "./DebugModal"
import {LeftPane} from "./LeftPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import {initSpace} from "../flows/initSpace"
import BoomGetModal from "./BoomGetModal"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import ErrorNotice from "./ErrorNotice"
import Handlers from "../state/Handlers"
import IngestProgress from "./IngestProgress"
import NewTabContent from "./NewTabContent"
import SearchHeaderChart from "./SearchHeaderChart"
import SearchResults from "./SearchResults/SearchResults"
import SettingsModal from "./SettingsModal"
import Tab from "../state/Tab"
import TabBar from "./TabBar/TabBar"
import WhoisModal from "./WhoisModal"
import useSearchShortcuts from "./useSearchShortcuts"

export default function SearchPage() {
  let dispatch = useDispatch()
  let space = useSelector(Tab.spaceName)
  useSearchShortcuts()

  useEffect(() => {
    // dispatch(initSpace(space))
    return () => dispatch(Handlers.abortAll())
  }, [])

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <TabBar />
          {space && (
            <>
              <SearchPageHeader />
              <SearchResults />
            </>
          )}
          {!space && <NewTabContent />}
        </div>
        <XRightPane />
      </div>
      <IngestProgress />
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

function SearchPageHeader() {
  return (
    <div className="search-page-header">
      <ControlBar />
      <SearchHeaderChart />
      <ColumnChooser />
    </div>
  )
}
