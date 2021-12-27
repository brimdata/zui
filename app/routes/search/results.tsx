import {Inspector} from "app/features/inspector/inspector"
import searchFieldContextMenu from "ppl/menus/searchFieldContextMenu"
import React from "react"
import {useDispatch} from "react-redux"
import {useResizeObserver} from "src/js/components/hooks/useResizeObserver"
import ResultsTable from "src/js/components/SearchResults/ResultsTable"
import {zed} from "@brimdata/zealot"
import {useResultsData} from "./data-hook"
import {useExpandState} from "./expand-hook"
import * as Styled from "./results.styled"
import {useResultsView} from "./view-hook"
import {MainInspector} from "./main-inspector"

export function Results() {
  const data = useResultsData()
  const expand = useExpandState()
  const view = useResultsView()
  const dispatch = useDispatch()
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
              onClick={view.setObjects}
              aria-pressed={view.isObjects}
            />
          </Styled.ButtonSwitch>
        </Styled.Group>
        {view.isObjects && (
          <Styled.Group>
            <Styled.ExpandAllButton onClick={expand.expandAll} />
            <Styled.CollapseAllButton onClick={expand.collapseAll} />
          </Styled.Group>
        )}
      </Styled.Toolbar>
      <Styled.Body ref={ref} data-test-locator="viewer_results">
        {view.isTable ? (
          <ResultsTable
            height={rect.height}
            width={rect.width}
            multiSelect={false}
          />
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
