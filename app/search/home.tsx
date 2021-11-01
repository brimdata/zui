import useIngestWatch from "app/search/hooks/use-ingest-watch"
import useColumns from "app/toolbar/hooks/useColumns"
import useExport from "app/toolbar/hooks/useExport"
import useView from "app/toolbar/hooks/useView"
import {Toolbar} from "app/toolbar/toolbar"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchHeaderChart from "src/js/components/SearchHeaderChart"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import SearchResults from "src/js/components/SearchResults/SearchResults"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Search from "src/js/state/Search"
import SearchBarState from "src/js/state/SearchBar"
import Url from "src/js/state/Url"
import usePluginToolbarItems from "../toolbar/hooks/usePluginToolbarItems"
import CommitNotification from "src/js/components/CommitNotification"
import Current from "src/js/state/Current"
import useLakeId from "app/router/hooks/use-lake-id"

function setSearchParamsFromUrl() {
  return function(dispatch, getState) {
    const url = Url.getSearchParams(getState())
    if (url.keep) {
      // only update things that can be empty and have defaults
      if (Url.getSpanParams(getState()).every((time) => !time)) {
        dispatch(Search.setSpanArgs(url.spanArgs))
      }
    } else {
      dispatch(Search.setSpanArgs(url.spanArgs))
      dispatch(Search.setSpanFocus(url.spanArgsFocus))
      dispatch(
        SearchBarState.restoreSearchBar({
          current: url.program || "",
          pinned: url.pins,
          error: null
        })
      )
    }
  }
}

export function InitSearchParams({children}) {
  const dispatch = useDispatch()
  const location = useSelector(Current.getLocation)

  useLayoutEffect(() => {
    /**
     * Each time the url changes, we update the ui components to reflect whats in the url,
     */
    dispatch(setSearchParamsFromUrl())
  }, [location.key])

  return children
}

export default function SearchHome() {
  useIngestWatch()
  const dispatch = useDispatch()
  const view = useView()
  const exportAction = useExport()
  const columns = useColumns()
  const pluginButtons = usePluginToolbarItems("search")
  const poolId = useLakeId()
  const actions = [...pluginButtons, exportAction, columns, view]

  return (
    <InitSearchParams>
      <SearchPageHeader>
        <Toolbar submit={() => dispatch(submitSearch())} actions={actions} />
        <SearchBar />
        <SearchHeaderChart />
      </SearchPageHeader>

      <SearchResults />
      <CommitNotification key={poolId} />
    </InitSearchParams>
  )
}
