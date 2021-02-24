import useSearchParams from "app/router/hooks/use-search-params"
import {Toolbar} from "app/toolbar/toolbar"
import React, {useLayoutEffect} from "react"
import {useDispatch} from "react-redux"
import {XDownloadProgress} from "src/js/components/DownloadProgress"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchHeaderChart from "src/js/components/SearchHeaderChart"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import SearchResults from "src/js/components/SearchResults/SearchResults"
import Search from "src/js/state/Search"
import SearchBarState from "src/js/state/SearchBar"

export function InitSearchParams({children}) {
  const dispatch = useDispatch()
  const params = useSearchParams()
  useLayoutEffect(() => {
    dispatch(Search.setSpanArgs(params.spanArgs))
    dispatch(Search.setSpanFocus(params.spanArgsFocus))
    dispatch(SearchBarState.changeSearchBarInput(params.program))
    dispatch(SearchBarState.setSearchBarPins(params.pins))
  }, [params])

  return children
}

export default function SearchHome() {
  return (
    <InitSearchParams>
      <SearchPageHeader>
        <Toolbar />
        <SearchBar />
        <SearchHeaderChart />
      </SearchPageHeader>

      <SearchResults />
      <XDownloadProgress />
      {/* <IngestRefresh /> */}
    </InitSearchParams>
  )
}
