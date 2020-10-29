import React from "react"

import {XDownloadProgress} from "./DownloadProgress"
import IngestRefresh from "./IngestRefresh"
import SearchPageHeader from "./SearchPageHeader"
import SearchResults from "./SearchResults/SearchResults"
import {SearchPageModals} from "./SearchPageModals"

export default function TabSearch() {
  return (
    <>
      <SearchPageHeader />
      <SearchResults />
      <XDownloadProgress />
      <IngestRefresh />
      <SearchPageModals />
    </>
  )
}
