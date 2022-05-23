import React from "react"
import {useSelector} from "react-redux"
import {useResizeObserver} from "src/js/components/hooks/useResizeObserver"
import {useResultsData} from "./data-hook"
import {MainInspector} from "./main-inspector"
import {ResultsError} from "./results-error"
import ResultsTable from "./results-table"
import * as Styled from "./results.styled"
import {useResultsView} from "./view-hook"
import Results from "src/js/state/Results"

const ResultsComponent = () => {
  const data = useResultsData()
  const view = useResultsView()
  const {ref, rect} = useResizeObserver()
  const error = useSelector(Results.getError)
  return (
    <Styled.BG>
      <Styled.Toolbar>
        <Styled.Group>
          <Styled.ButtonSwitch>
            <Styled.TableButton
              onClick={view.setTable}
              aria-pressed={view.isTable}
            />
            <Styled.ObjectsButton
              onClick={view.setInspector}
              aria-pressed={view.isInspector}
            />
          </Styled.ButtonSwitch>
        </Styled.Group>
      </Styled.Toolbar>
      <Styled.Body ref={ref} data-test-locator="viewer_results">
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
      </Styled.Body>
    </Styled.BG>
  )
}

export default ResultsComponent
