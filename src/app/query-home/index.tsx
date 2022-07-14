import ResultsComponent from "./results"
import React from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Current from "src/js/state/Current"
import styled from "styled-components"
import ToolbarButton from "./toolbar/button"
import tabHistory from "../router/tab-history"
import {lakeQueryPath} from "../router/utils/paths"
import SearchArea from "./search-area"
import RightPane from "../features/right-pane"
import {usePinContainerDnd} from "./search-area/pins/use-pin-dnd"
import Queries from "src/js/state/Queries"
import {TitleBar} from "./title-bar/title-bar"
import {ResultsToolbar} from "./toolbar/results-toolbar"

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
  min-height: 0;
`

const QueryHome = () => {
  const query = useSelector(Current.getQuery)
  const lakeId = useSelector(Current.getLakeId)
  const drop = usePinContainerDnd()
  const dispatch = useDispatch()

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
            const {id} = dispatch(Queries.create())
            dispatch(tabHistory.replace(lakeQueryPath(id, lakeId)))
          }}
          text={"New Query"}
        />
      </PageWrap>
    )

  return (
    <>
      <ContentWrap>
        <MainContent>
          <TitleBar ref={drop} />
          <SearchArea />
          <ResultsToolbar />
          <ResultsComponent />
        </MainContent>
        <RightPane />
      </ContentWrap>
    </>
  )
}

export default QueryHome
