import React, {useCallback, useContext, useMemo, useState} from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

import styled from "styled-components"
import {lakeQueryPath} from "../router/utils/paths"
import SearchArea from "./search-area"
import RightPane from "../features/right-pane"
import {TitleBar} from "./title-bar/title-bar"
import {ResultsToolbar} from "./toolbar/results-toolbar"
import {Redirect} from "react-router"
import {ActiveQuery} from "../core/models/active-query"
import {ResultsPane} from "src/panes/results-pane/results-pane"
import {TableViewApi} from "src/zui-kit/core/table-view/table-view-api"
import {HistogramPane} from "src/panes/histogram-pane/pane"
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels"
import styles from "./query-home.module.css"
import {useDispatch} from "../core/state"
import Layout from "src/js/state/Layout"
import useSelect from "../core/hooks/use-select"

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

const ResultsContext = React.createContext<{
  table: TableViewApi | null
  setTable: (v: TableViewApi | null) => void
  query: ActiveQuery
}>(null)

export function useResultsContext() {
  const value = useContext(ResultsContext)
  if (!value) throw new Error("Provide MainTableContext")
  return value
}

function ResultsProvider({children}) {
  const [table, setTable] = useState<TableViewApi | null>(null)
  const query = useSelector(Current.getActiveQuery)
  const value = {
    query,
    table,
    setTable: useCallback((table: TableViewApi | null) => setTable(table), []),
  }
  return (
    <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
  )
}

const QueryHome = () => {
  const activeQuery = useSelector(Current.getActiveQuery)
  const lakeId = useSelector(Current.getLakeId)
  const tabId = useSelector(Current.getTabId)
  const select = useSelect()
  const dispatch = useDispatch()

  if (activeQuery.isDeleted()) {
    return (
      <Redirect
        to={lakeQueryPath(tabId, lakeId, activeQuery.versionId() || "0")}
      />
    )
  }

  const panelStorage = useMemo(() => {
    return {
      setItem(_: string, value: string) {
        dispatch(Layout.setQueryPanels(value))
      },
      getItem(_: string) {
        return select(Layout.getQueryPanels)
      },
    }
  }, [])

  return (
    <ResultsProvider>
      <ContentWrap>
        <MainContent>
          <PanelGroup
            key={tabId}
            direction="vertical"
            autoSaveId="queryPanels"
            storage={panelStorage}
          >
            <Panel minSize={15} defaultSize={25}>
              <TitleBar />
              <SearchArea />
            </Panel>
            <PanelResizeHandle className={styles.invisibleResizeHandle} />
            <Panel defaultSize={75} minSize={15} className={styles.panel}>
              <HistogramPane />
              <ResultsToolbar />
              <ResultsPane />
            </Panel>
          </PanelGroup>
        </MainContent>
        <RightPane />
      </ContentWrap>
    </ResultsProvider>
  )
}

export default QueryHome
