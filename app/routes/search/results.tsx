import Icon from "app/core/Icon"
import {Inspector} from "app/features/inspector/inspector"
import initialViewerSearch from "app/search/flows/initial-viewer-search"
import classNames from "classnames"
import searchFieldContextMenu from "ppl/menus/searchFieldContextMenu"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useResizeObserver} from "src/js/components/hooks/useResizeObserver"
import ResultsTable from "src/js/components/SearchResults/ResultsTable"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"
import Viewer from "src/js/state/Viewer"
import styled from "styled-components"
import {zed} from "zealot"

const BG = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  position: relative;
  flex: 1;
`

const Toolbar = styled.header`
  background: var(--ivory);
  border-bottom: 1px solid var(--pane-border);
  border-top: none;
  flex: 0 0 25px;
  display: flex;
  align-items: center;
`
const Body = styled.div`
  flex: 1;
`

const Button = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 34px;
  border-radius: 3px;

  svg {
    width: 18px;
    height: 18px;
    fill: var(--aqua);
  }
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  &.active,
  &:active {
    background: rgba(0, 0, 0, 0.12);
  }
`

const ButtonSwitch = styled.nav`
  border-radius: 3px;
  background: rgba(0, 0, 0, 0);
  display: flex;

  transition: background 300ms;
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  ${Button}:not(.active):hover {
    background: none;
  }
`

const Group = styled.div`
  display: flex;
  margin: 0 12px;
`

export function Results() {
  const {ref, rect} = useResizeObserver()
  const dispatch = useDispatch()
  const location = useSelector(Current.getLocation)
  const status = useSelector(Viewer.getStatus)
  const viewerKey = useSelector(Viewer.getSearchKey)
  const values = useSelector(Viewer.getLogs)

  useLayoutEffect(() => {
    if (status === "INIT" || viewerKey !== location.key) {
      dispatch(initialViewerSearch())
    }
  }, [location.key])

  const [view, setView] = Tab.useState<"table" | "objects">(
    "results.view",
    "objects"
  )

  const [defaultExpanded, setDefaultExpanded] = Tab.useState<boolean>(
    "results.view.objects.defaultExpanded",
    false
  )

  const [expanded, setExpanded] = Tab.useState(
    "results.view.objects.expanded",
    new Map()
  )

  return (
    <BG className="search-results">
      <Toolbar>
        <Group>
          <ButtonSwitch>
            <Button
              title="Show Table View"
              onClick={() => setView("table")}
              className={classNames({active: view === "table"})}
            >
              <Icon name="columns" />
            </Button>
            <Button
              title="Show Objects View"
              onClick={() => setView("objects")}
              className={classNames({active: view === "objects"})}
            >
              <Icon name="braces" />
            </Button>
          </ButtonSwitch>
        </Group>
        {view === "objects" && (
          <Group>
            <Button
              title="Expand All"
              onClick={() => {
                setDefaultExpanded(true)
                setExpanded(new Map())
              }}
            >
              <Icon name="expand" />
            </Button>
            <Button
              title="Collapse All"
              onClick={() => {
                setDefaultExpanded(false)
                setExpanded(new Map())
              }}
            >
              <Icon name="collapse" />
            </Button>
          </Group>
        )}
      </Toolbar>
      <Body ref={ref}>
        {view === "table" ? (
          <ResultsTable
            height={rect.height}
            width={rect.width}
            multiSelect={false}
          />
        ) : (
          <div style={{height: 0, width: 0, overflow: "visible"}}>
            <Inspector
              defaultExpanded={defaultExpanded}
              expanded={expanded}
              setExpanded={setExpanded}
              height={rect.height}
              width={rect.width}
              values={values}
              onContextMenu={(e, value: zed.AnyValue, field: zed.Field) =>
                dispatch(
                  searchFieldContextMenu({
                    value,
                    field,
                    record: field.rootRecord
                  })
                )
              }
            />
          </div>
        )}
      </Body>
    </BG>
  )
}
