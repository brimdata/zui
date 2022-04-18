import {updateQuery} from "src/app/query-home/flows/update-query"
import {useExpandState} from "src/app/query-home/results/expand-hook"
import {DRAFT_QUERY_NAME} from "src/app/query-home/utils/brim-query"
import {ActionButtonProps} from "src/app/toolbar/action-button"
import Layout from "src/js/state/Layout"
import Results from "./results"
import React, {useLayoutEffect} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Current from "src/js/state/Current"
import SearchBarState from "src/js/state/SearchBar"
import usePluginToolbarItems from "../toolbar/hooks/usePluginToolbarItems"
import Toolbar from "./toolbar"
import styled from "styled-components"
import useExport from "./toolbar/hooks/use-export"
import useColumns from "./toolbar/hooks/use-columns"
import DraftQueries from "src/js/state/DraftQueries"
import SearchBarActions from "src/js/state/SearchBar"
import {syncPool} from "../core/pools/sync-pool"
import ToolbarButton from "./toolbar/button"
import {newQuery} from "./flows/new-query"
import tabHistory from "../router/tab-history"
import {lakeQueryPath} from "../router/utils/paths"
import {getQuerySource} from "./flows/get-query-source"
import SearchArea from "./search-area"
import {FeatureFlag} from "../core/feature-flag"
import RightPane from "../features/right-pane"

const syncQueryLocationWithRedux = (dispatch, getState) => {
  const {queryId} = Current.getQueryLocationData(getState())
  const lakeId = Current.getLakeId(getState())
  const query = Current.getQuery(getState())
  const isDraft = dispatch(getQuerySource(queryId)) === "draft"
  const pool = Current.getQueryPool(getState())
  if (pool && !pool.hasSpan()) dispatch(syncPool(pool.id, lakeId))
  if (!query && queryId && isDraft) {
    // reset drafts?
    dispatch(
      DraftQueries.set({
        id: queryId,
        name: DRAFT_QUERY_NAME,
        value: "",
        pins: {},
      })
    )
  }
  // Give codemirror a chance to update by scheduling this update
  setTimeout(() => {
    dispatch(
      SearchBarState.restoreSearchBar({
        current: query?.value || "",
        pinned: query?.getFilterPins()?.map((p) => p.toString()) || [],
        error: null,
      })
    )
  })
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
      click: () => expandAll(),
    },
    {
      label: "Collapse",
      title: "Collapse all inspector view entries",
      icon: "collapse",
      disabled,
      click: () => collapseAll(),
    },
  ]
}
const usePin = (): ActionButtonProps => {
  const dispatch = useDispatch()
  return {
    label: "Pin",
    title: "Pin current search term",
    icon: "pin",
    click: () => {
      dispatch((d, getState) => {
        const state = getState()
        const query = Current.getQuery(state)
        const searchTerm = SearchBarActions.getSearchBarInputValue(state)
        query.addFilterPin(searchTerm)
        query.value = ""
        d(updateQuery(query))
        d(SearchBarActions.pinSearchBar())
      })
    },
  }
}

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: scroll;

  button > span {
    ${(p) => p.theme.typography.labelNormal}
    color: black;
  }
`

const StyledHeader = styled.h1`
  margin: 96px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.headingPage}
`

const StyledSubHeader = styled.h2`
  margin: 18px 0;
  width: 500px;
  color: var(--aqua);
  ${(p) => p.theme.typography.labelNormal}
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ContentWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const QueryHome = () => {
  useSearchParamLocationSync()
  const query = useSelector(Current.getQuery)
  const lakeId = useSelector(Current.getLakeId)
  const dispatch = useDispatch()
  const exportAction = useExport()
  const columns = useColumns()
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
  ]

  if (!query)
    return (
      <PageWrap>
        <StyledHeader>Query Removed</StyledHeader>
        <StyledSubHeader>
          The query this tab was previously viewing has been removed. Use the
          left sidebar to open an existing query, or begin a new draft.
        </StyledSubHeader>
        <ToolbarButton
          onClick={() => {
            const {id} = dispatch(newQuery())
            dispatch(tabHistory.replace(lakeQueryPath(id, lakeId)))
          }}
          text={"New Draft"}
        />
      </PageWrap>
    )

  return (
    <>
      <QueryPageHeader>
        <Toolbar actions={actions} />
      </QueryPageHeader>
      <ContentWrap>
        <MainContent>
          <SearchArea />
          <Results />
        </MainContent>
        <FeatureFlag name="query-flow" on={<RightPane />} off={null} />
      </ContentWrap>
    </>
  )
}

export default QueryHome
