import {useExpandState} from "src/app/query-home/results/expand-hook"
import Layout from "src/js/state/Layout"
import ResultsComponent from "./results"
import React from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Current from "src/js/state/Current"
import Toolbar from "./toolbar"
import styled from "styled-components"
import useExport from "./toolbar/hooks/use-export"
import useColumns from "./toolbar/hooks/use-columns"
import ToolbarButton from "./toolbar/button"
import {newDraftQuery} from "src/js/state/DraftQueries/flows/new-draft-query"
import tabHistory from "../router/tab-history"
import {lakeQueryPath} from "../router/utils/paths"
import SearchArea from "./search-area"
import RightPane from "../features/right-pane"
import usePins from "./toolbar/hooks/use-pins"
import {usePinContainerDnd} from "./search-area/pins/use-pin-dnd"
import {ActionButtonProps} from "./toolbar/action-button"
import usePluginToolbarItems from "./toolbar/hooks/use-plugin-toolbar-items"

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
  const query = useSelector(Current.getQuery)
  const lakeId = useSelector(Current.getLakeId)
  const drop = usePinContainerDnd()
  const dispatch = useDispatch()
  const exportAction = useExport()
  const columns = useColumns()
  const pin = usePins()
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
            const {id} = dispatch(newDraftQuery())
            dispatch(tabHistory.replace(lakeQueryPath(id, lakeId)))
          }}
          text={"New Draft"}
        />
      </PageWrap>
    )

  return (
    <>
      <QueryPageHeader ref={drop}>
        <Toolbar actions={actions} />
      </QueryPageHeader>
      <ContentWrap>
        <MainContent>
          <SearchArea />
          <ResultsComponent />
        </MainContent>
        <RightPane />
      </ContentWrap>
    </>
  )
}

export default QueryHome
