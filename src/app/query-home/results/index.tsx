import React from "react"
import {useResizeObserver} from "src/js/components/hooks/useResizeObserver"
import {useResultsData} from "./data-hook"
import {MainInspector} from "./main-inspector"
import ResultsTable from "./results-table"
import * as Styled from "./results.styled"
import {useResultsView} from "./view-hook"

const Results = () => {
  const data = useResultsData()
  const view = useResultsView()
  const {ref, rect} = useResizeObserver()

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
        {view.isTable ? (
          <ResultsTable height={rect.height} width={rect.width} />
        ) : (
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

export default Results
