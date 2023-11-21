import React from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

import styled from "styled-components"
import {queryPath} from "../router/utils/paths"
import SearchArea from "./search-area"
import RightPane from "../features/right-pane"
import {TitleBar} from "./title-bar/title-bar"
import {ResultsToolbar} from "./toolbar/results-toolbar"
import {Redirect} from "react-router"
import {ResultsPane} from "src/views/results-pane"
import {HistogramPane} from "src/views/histogram-pane"

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-width: 320px;
  background: white;
`

const ContentWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
`

const QueryHome = () => {
  const activeQuery = useSelector(Current.getActiveQuery)
  const tabId = useSelector(Current.getTabId)

  if (activeQuery.isDeleted()) {
    return <Redirect to={queryPath(tabId, activeQuery.versionId() || "0")} />
  }

  return (
    <ContentWrap>
      <MainContent>
        <TitleBar />
        <SearchArea />
        <ResultsToolbar />
        <HistogramPane />
        <ResultsPane />
      </MainContent>
      <RightPane />
    </ContentWrap>
  )
}

export default QueryHome
