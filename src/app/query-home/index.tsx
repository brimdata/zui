import ResultsComponent from "./results"
import React from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

import styled from "styled-components"
import {lakeQueryPath} from "../router/utils/paths"
import SearchArea from "./search-area"
import RightPane from "../features/right-pane"
import {TitleBar} from "./title-bar/title-bar"
import {ResultsToolbar} from "./toolbar/results-toolbar"
import {Redirect} from "react-router"
import MainHistogramChart from "./histogram/MainHistogram/Chart"

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-width: 0;
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
  const lakeId = useSelector(Current.getLakeId)
  const tabId = useSelector(Current.getTabId)

  if (activeQuery.isDeleted()) {
    return (
      <Redirect
        to={lakeQueryPath(tabId, lakeId, activeQuery.versionId() || "0")}
      />
    )
  }

  return (
    <>
      <ContentWrap>
        <MainContent>
          <TitleBar />
          <SearchArea />
          <ResultsToolbar />
          <MainHistogramChart />
          <ResultsComponent />
        </MainContent>
        <RightPane />
      </ContentWrap>
    </>
  )
}

export default QueryHome
