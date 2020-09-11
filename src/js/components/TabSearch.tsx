import React from "react"

import {DebugModal} from "./DebugModal"
import {XDownloadProgress} from "./DownloadProgress"
import CurlModal from "./CurlModal"
import EmptySpaceModal from "./EmptySpaceModal"
import IngestRefresh from "./IngestRefresh"
import IngestWarningsModal from "./IngestWarningsModal"
import SearchPageHeader from "./SearchPageHeader"
import SearchResults from "./SearchResults/SearchResults"
import WhoisModal from "./WhoisModal"
import ZQModal from "./ZQModal"
import NewConnectionModal from "./NewConnectionModal"

export default function TabSearch() {
  return (
    <>
      <SearchPageHeader />
      <SearchResults />
      <WhoisModal />
      <DebugModal />
      <CurlModal />
      <EmptySpaceModal />
      <ZQModal />
      <XDownloadProgress />
      <IngestWarningsModal />
      <NewConnectionModal />
      <IngestRefresh />
    </>
  )
}
