import useSearchParams from "app/router/hooks/use-search-params"
import {dispatch} from "d3"
import React, {useLayoutEffect} from "react"
import {useDispatch} from "react-redux"
import {XDownloadProgress} from "src/js/components/DownloadProgress"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import SearchResults from "src/js/components/SearchResults/SearchResults"
import Search from "src/js/state/Search"
import SearchBar from "src/js/state/SearchBar"

export function InitSearchParams({children}) {
  const dispatch = useDispatch()
  const params = useSearchParams()
  useLayoutEffect(() => {
    dispatch(Search.setSpanArgs(params.spanArgs))
    dispatch(Search.setSpanFocus(params.spanArgsFocus))
    dispatch(SearchBar.changeSearchBarInput(params.program))
    dispatch(SearchBar.setSearchBarPins(params.pins))
  }, [params])

  return children
}

export default function SearchHome() {
  return (
    <InitSearchParams>
      <SearchPageHeader />
      <SearchResults />
      <XDownloadProgress />
      {/* <IngestRefresh /> */}
    </InitSearchParams>
  )
}
