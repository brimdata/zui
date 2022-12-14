import React, {useDeferredValue} from "react"
import {useSelector} from "react-redux"
import {useResizeObserver} from "src/js/components/hooks/useResizeObserver"
import {useResultsData} from "./data-hook"
import Results from "src/js/state/Results"
import styled from "styled-components"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import {MainTable} from "src/panes/main-table/main-table"
import {ResultsError} from "./errors/results-error"
import {MainInspector} from "./main-inspector"
import Layout from "src/js/state/Layout"

const BG = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  position: relative;
  flex: 1;
  min-height: 0;
`

const Body = styled.div`
  flex: 1;
  overflow: hidden;
`

const ResultsComponent = () => {
  const data = useResultsData()
  const realView = useSelector(Layout.getResultsView)
  const view = useDeferredValue(realView)
  const {ref, rect} = useResizeObserver()
  const error = useSelector(Results.getError(MAIN_RESULTS))
  return (
    <BG>
      <AppErrorBoundary>
        <Body ref={ref} data-test-locator="viewer_results">
          {error && <ResultsError error={error} />}
          {!error && view === "TABLE" && <MainTable {...rect} />}
          {!error && view === "INSPECTOR" && (
            <div
              style={{
                height: 0,
                width: 0,
                overflow: "visible",
                paddingLeft: "2px",
              }}
            >
              <MainInspector
                height={rect.height}
                width={rect.width}
                values={data.values}
              />
            </div>
          )}
        </Body>
      </AppErrorBoundary>
    </BG>
  )
}

export default ResultsComponent
