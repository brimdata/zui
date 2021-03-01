import useRefresh from "app/toolbar/hooks/useRefresh"
import useView from "app/toolbar/hooks/useView"
import {Toolbar} from "app/toolbar/toolbar"
import Summary from "ppl/summary/summary"
import React from "react"
import {useDispatch} from "react-redux"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import changeSpan from "./flows/change-span"
import useIngestWatch from "./hooks/use-ingest-watch"

function InitSummaryParams({children}) {
  useIngestWatch()
  return children
}

export default function SummaryHome() {
  const dispatch = useDispatch()
  const view = useView()
  const refresh = useRefresh()
  return (
    <InitSummaryParams>
      <SearchPageHeader>
        <Toolbar
          submit={() => dispatch(changeSpan())}
          actions={[view, refresh]}
        />
        <SearchBar />
      </SearchPageHeader>
      <Summary />
    </InitSummaryParams>
  )
}
