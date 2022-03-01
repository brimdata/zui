import {updateQuery} from "src/app/query-home/flows/update-query"
import {useExpandState} from "src/app/query-home/results/expand-hook"
import {DRAFT_QUERY_NAME} from "src/app/query-home/utils/brim-query"
import {ActionButtonProps} from "src/app/toolbar/action-button"
import Layout from "src/js/state/Layout"
import Results from "./results"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import SearchBarState from "src/js/state/SearchBar"
import usePluginToolbarItems from "../toolbar/hooks/usePluginToolbarItems"
import SearchBar from "./search-bar"
import Toolbar from "./toolbar"
import styled from "styled-components"
import useRun from "./toolbar/hooks/use-run"
import useExport from "./toolbar/hooks/use-export"
import useColumns from "./toolbar/hooks/use-columns"
import DraftQueries from "src/js/state/DraftQueries"
import SearchBarActions from "src/js/state/SearchBar"
import {syncPool} from "../core/pools/sync-pool"

const syncQueryLocationWithRedux = (dispatch, getState) => {
  const {queryId, isDraft} = Current.getQueryLocationData(getState())
  const lakeId = Current.getLakeId(getState())
  const query = Current.getQuery(getState())
  const pool = Current.getQueryPool(getState())
  if (pool && !pool.hasSpan()) dispatch(syncPool(pool.id, lakeId))
  if (!query && queryId && isDraft) {
    // reset drafts?
    dispatch(
      DraftQueries.set({
        id: queryId,
        name: DRAFT_QUERY_NAME,
        value: "",
        pins: {}
      })
    )
  }
  dispatch(
    SearchBarState.restoreSearchBar({
      current: query?.value || "",
      pinned: query?.getFilterPins()?.map((p) => p.toString()) || [],
      error: null
    })
  )
}

export function useSearchParamLocationSync() {
  const dispatch = useDispatch()
  const location = useSelector(Current.getLocation)

  useLayoutEffect(() => {
    dispatch(syncQueryLocationWithRedux)
  }, [location.key])
}

const QueryPageHeader = styled.div`
  background: white;
  z-index: 1;
  padding: 10px 16px;
  user-select: none;
`

const useInspectorButtons = (): ActionButtonProps[] => {
  const {expandAll, collapseAll} = useExpandState()
  const view = useSelector(Layout.getResultsView)

  const disabled = view !== "INSPECTOR"
  return [
    {
      label: "Expand",
      title: "Expand all inspector view entries",
      icon: "expand",
      disabled,
      click: () => expandAll()
    },
    {
      label: "Collapse",
      title: "Collapse all inspector view entries",
      icon: "collapse",
      disabled,
      click: () => collapseAll()
    }
  ]
}
const usePin = (): ActionButtonProps => {
  const dispatch = useDispatch()
  const query = useSelector(Current.getQuery)
  const searchTerm = useSelector(SearchBarActions.getSearchBarInputValue)
  return {
    label: "Pin",
    title: "Pin current search term",
    icon: "pin",
    click: () => {
      query.addFilterPin(searchTerm)
      query.value = ""
      dispatch(updateQuery(query))
      dispatch(SearchBarActions.pinSearchBar())
    }
  }
}

const QueryHome = () => {
  useSearchParamLocationSync()
  const exportAction = useExport()
  const columns = useColumns()
  const run = useRun()
  const pin = usePin()
  const pluginButtons = usePluginToolbarItems("search")
  const [expandButton, collapseButton] = useInspectorButtons()
  const actions = [
    ...pluginButtons,
    expandButton,
    collapseButton,
    exportAction,
    columns,
    pin,
    run
  ]

  return (
    <>
      <QueryPageHeader>
        <Toolbar actions={actions} />
        <SearchBar />
      </QueryPageHeader>
      <Results />
    </>
  )
}

export default QueryHome
