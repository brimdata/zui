import React from "react"
import {useSelector} from "react-redux"
import Feature from "../state/Feature"
import Layout from "../state/Layout"
import {XDownloadProgress} from "./DownloadProgress"
import IngestRefresh from "./IngestRefresh"
import SearchPageHeader from "./SearchPageHeader"
import SearchResults from "./SearchResults/SearchResults"

function TabMain() {
  const showSummary = useSelector(Feature.show("summary"))
  const view = useSelector(Layout.getMainView)
  if (showSummary) {
    switch (view) {
      case "search":
        return <SearchResults />
      case "summary":
        return <h1>:: Summary ::</h1>
      default:
        null
    }
  } else {
    return <SearchResults />
  }
}

export default function TabSearch() {
  return (
    <>
      <SearchPageHeader />
      <TabMain />
      <XDownloadProgress />
      <IngestRefresh />
    </>
  )
}
