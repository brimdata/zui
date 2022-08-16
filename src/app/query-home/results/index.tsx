import React from "react"
import {useSelector} from "react-redux"
import {useResizeObserver} from "src/js/components/hooks/useResizeObserver"
import {useResultsData} from "./data-hook"
import {MainInspector} from "./main-inspector"
import {ResultsError} from "./results-error"
import ResultsTable from "./results-table"
import {useResultsView} from "./view-hook"
import Results from "src/js/state/Results"
import styled from "styled-components"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"

const BG = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  position: relative;
  flex: 1;
`

const Body = styled.div`
  flex: 1;
`

const ResultsComponent = () => {
  const data = useResultsData()
  const view = useResultsView()
  const {ref, rect} = useResizeObserver()
  const error = useSelector(Results.getError(MAIN_RESULTS))

  return (
    <BG>
      <AppErrorBoundary>
        <Body ref={ref} data-test-locator="viewer_results">
          {error && <ResultsError error={error} />}
          {!error && view.isTable && (
            <ResultsTable height={rect.height} width={rect.width} />
          )}
          {!error && view.isInspector && (
            <div style={{height: 0, width: 0, overflow: "visible"}}>
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
