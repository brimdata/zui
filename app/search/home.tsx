import useColumns from "app/toolbar/hooks/useColumns"
import useExport from "app/toolbar/hooks/useExport"
import usePackets from "app/toolbar/hooks/usePackets"
import useView from "app/toolbar/hooks/useView"
import {Toolbar} from "app/toolbar/toolbar"
import React, {useLayoutEffect} from "react"
import {useDispatch, useStore} from "react-redux"
import {useLocation} from "react-router"
import {XDownloadProgress} from "src/js/components/DownloadProgress"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchHeaderChart from "src/js/components/SearchHeaderChart"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import SearchResults from "src/js/components/SearchResults/SearchResults"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Search from "src/js/state/Search"
import SearchBarState from "src/js/state/SearchBar"
import Url from "src/js/state/Url"

export function InitSearchParams({children}) {
  const dispatch = useDispatch()
  const location = useLocation()
  const store = useStore()
  useLayoutEffect(() => {
    /**
     * Each time the url changes, we update the ui components to reflect whats in the url
     */
    const url = Url.getSearchParams(store.getState())
    dispatch(Search.setSpanArgs(url.spanArgs))
    dispatch(Search.setSpanFocus(url.spanArgsFocus))
    dispatch(
      SearchBarState.restoreSearchBar({
        current: url.program,
        previous: url.program,
        pinned: url.pins,
        error: null
      })
    )
  }, [location.key])

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
