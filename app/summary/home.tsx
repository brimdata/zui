import Summary from "ppl/summary/summary"
import React from "react"
import {XDownloadProgress} from "src/js/components/DownloadProgress"
import IngestRefresh from "src/js/components/IngestRefresh"
import SearchPageHeader from "src/js/components/SearchPageHeader"

export default function Home() {
  return (
    <>
      <SearchPageHeader />
      <Summary />
      <XDownloadProgress />
      <IngestRefresh />
    </>
  )
}
