import React from "react"
import {XDownloadProgress} from "src/js/components/DownloadProgress"
import IngestRefresh from "src/js/components/IngestRefresh"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import SearchResults from "src/js/components/SearchResults/SearchResults"

export default function Home() {
  return (
    <>
      <SearchPageHeader />
      <SearchResults />
      <XDownloadProgress />
      <IngestRefresh />
    </>
  )
}
