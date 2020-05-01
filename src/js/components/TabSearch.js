/* @flow */
import React from "react"

import {DebugModal} from "./DebugModal"
import {XDownloadProgress} from "./DownloadProgress"
import ControlBar from "./ControlBar"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import IngestRefresh from "./IngestRefresh"
import IngestWarningsModal from "./IngestWarningsModal"
import SearchHeaderChart from "./SearchHeaderChart"
import SearchResults from "./SearchResults/SearchResults"
import WhoisModal from "./WhoisModal"
import ZQModal from "./ZQModal"

export default function TabSearch() {
  return (
    <>
      <div className="search-page-header">
        <ControlBar />
        <SearchHeaderChart />
      </div>
      <SearchResults />
      <WhoisModal />
      <DebugModal />
      <CurlModal />
      <EmptySpaceModal />
      <ZQModal />
      <XDownloadProgress />
      <IngestWarningsModal />
      <IngestRefresh />
    </>
  )
}
