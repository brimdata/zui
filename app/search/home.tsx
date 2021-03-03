import useSearchParams from "app/router/hooks/use-search-params"
import useColumns from "app/toolbar/hooks/useColumns"
import useExport from "app/toolbar/hooks/useExport"
import usePackets from "app/toolbar/hooks/usePackets"
import useView from "app/toolbar/hooks/useView"
import {Toolbar} from "app/toolbar/toolbar"
import React, {useLayoutEffect} from "react"
import {useDispatch} from "react-redux"
import {XDownloadProgress} from "src/js/components/DownloadProgress"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchHeaderChart from "src/js/components/SearchHeaderChart"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import SearchResults from "src/js/components/SearchResults/SearchResults"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Search from "src/js/state/Search"
import SearchBarState from "src/js/state/SearchBar"

export function InitSearchParams({children}) {
  // const dispatch = useDispatch()
  const params = useSearchParams()
  useLayoutEffect(() => {
    // dispatch(Search.setSpanArgs(params.spanArgs))
    // dispatch(Search.setSpanFocus(params.spanArgsFocus))
    // dispatch(SearchBarState.changeSearchBarInput(params.program))
    // dispatch(SearchBarState.setSearchBarPins(params.pins))
  }, [params])

  return children
}

export default function SearchHome() {
  const dispatch = useDispatch()
  const view = useView()
  const packets = usePackets()
  const exportAction = useExport()
  const columns = useColumns()
  return (
    <InitSearchParams>
      <SearchPageHeader>
        <Toolbar
          submit={() => dispatch(submitSearch())}
          actions={[packets, exportAction, columns, view]}
        />
        <SearchBar />
        <SearchHeaderChart />
      </SearchPageHeader>

      <SearchResults />
      <XDownloadProgress />
    </InitSearchParams>
  )
}
