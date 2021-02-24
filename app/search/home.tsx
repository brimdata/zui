import useSearchParams from "app/router/hooks/use-search-params"
import React, {useLayoutEffect} from "react"
import {useDispatch} from "react-redux"
import {XDownloadProgress} from "src/js/components/DownloadProgress"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import SearchResults from "src/js/components/SearchResults/SearchResults"
import Search from "src/js/state/Search"
import SearchBar from "src/js/state/SearchBar"

function InitSearchParams({children}) {
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
