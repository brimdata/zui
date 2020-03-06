/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {DebugModal} from "./DebugModal"
import {LeftPane} from "./LeftPane"
import {XDownloadProgress} from "./DownloadProgress"
import {XRightPane} from "./RightPane"
import ZQGetModal from "./ZQGetModal"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import ErrorNotice from "./ErrorNotice"
import Handlers from "../state/Handlers"
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
    return () => dispatch(Handlers.abortAll())
  }, [])

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <TabBar />
          <div className="search-page-header">
            <ControlBar />
            {space && (
              <>
                <SearchHeaderChart />
                <ColumnChooser />
              </>
            )}
          </div>
          {space ? <SearchResults /> : <NewTabContent />}
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
      <ZQGetModal />
    </div>
  )
}
