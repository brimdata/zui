/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {DebugModal} from "./DebugModal"
import {XDownloadProgress} from "./DownloadProgress"
import ColumnChooser from "./ColumnChooser"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import Search from "../state/Search"
import SearchHeaderChart from "./SearchHeaderChart"
import SearchResults from "./SearchResults/SearchResults"
import Tab from "../state/Tab"
import WhoisModal from "./WhoisModal"
import ZQModal from "./ZQModal"
import brim from "../brim"
import submitSearch from "../flows/submitSearch"

export default function TabSearch() {
  let dispatch = useDispatch()
  let firstVisit = !useSelector(Tab.currentEntry)
  let space = useSelector(Tab.space)

  useEffect(() => {
    if (firstVisit) {
      dispatch(Search.setSpanArgs(brim.space(space).everythingSpan()))
      dispatch(submitSearch())
    }
  }, [firstVisit])

  return (
    <>
      <div className="search-page-header">
        <ControlBar />
        <SearchHeaderChart />
        <ColumnChooser />
      </div>
      <SearchResults />
      <WhoisModal />
      <DebugModal />
      <CurlModal />
      <EmptySpaceModal />
      <ZQModal />
      <XDownloadProgress />
    </>
  )
}
