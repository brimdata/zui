import {Results} from "src/app/routes/search/results"
import useColumns from "src/app/toolbar/hooks/useColumns"
import useExport from "src/app/toolbar/hooks/useExport"
import useView from "src/app/toolbar/hooks/useView"
import {Toolbar} from "src/app/toolbar/toolbar"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {SearchBar} from "src/js/components/SearchBar/mod"
import SearchHeaderChart from "src/js/components/SearchHeaderChart"
import SearchPageHeader from "src/js/components/SearchPageHeader"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Current from "src/js/state/Current"
import Search from "src/js/state/Search"
import SearchBarState from "src/js/state/SearchBar"
import Url from "src/js/state/Url"
import usePluginToolbarItems from "../toolbar/hooks/usePluginToolbarItems"

function setSearchParamsFromUrl() {
  return function(dispatch, getState) {
    const url = Url.getSearchParams(getState())
    dispatch(Search.setSpanArgs(url.spanArgs))
    dispatch(
      SearchBarState.restoreSearchBar({
        current: url.program || "",
        pinned: url.pins,
        error: null
      })
    )
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
  const dispatch = useDispatch()
  const view = useView()
  const exportAction = useExport()
  const columns = useColumns()
  const pluginButtons = usePluginToolbarItems("search")
  const actions = [...pluginButtons, exportAction, columns, view]
  return (
    <InitSearchParams>
      <SearchPageHeader>
        <Toolbar submit={() => dispatch(submitSearch())} actions={actions} />
        <SearchBar />
        <SearchHeaderChart />
      </SearchPageHeader>
      <Results />
    </InitSearchParams>
  )
}
