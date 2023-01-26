import React from "react"
import DetailSection from "./detail-section"

import styled from "styled-components"
import {useDispatch} from "src/app/core/state"
import {useSelector} from "react-redux"
import Layout from "../../../js/state/Layout"
import {DraggablePane} from "src/js/components/draggable-pane"
import VersionsSection from "./versions-section"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import {HistorySection} from "./history/section"
import {SectionTabs} from "src/components/section-tabs"
import {PaneName} from "src/js/state/Layout/types"
import {ColumnsPane} from "src/panes/columns-pane/columns-pane"

const Pane = styled(DraggablePane)`
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-color);
  background: white;
`

const PaneContentSwitch = ({paneName}) => {
  switch (paneName) {
    case "detail":
      return <DetailSection />
    case "versions":
      return <VersionsSection />
    case "history":
      return <HistorySection />
    case "columns":
      return <ColumnsPane />
    default:
      return null
  }
}

const BG = styled.div`
  height: 37px;
  background: var(--chrome-color);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  padding: 0 8px;
`

export function Menu() {
  const dispatch = useDispatch()
  const currentPaneName = useSelector(Layout.getCurrentPaneName)
  const onChange = (name: string) => {
    if (name === currentPaneName) return
    dispatch(Layout.setCurrentPaneName(name as PaneName))
  }

  function makeOption(label: string, value: string) {
    return {
      label,
      click: () => onChange(value),
      checked: currentPaneName === value,
    }
  }

  return (
    <BG>
      <SectionTabs
        options={[
          makeOption("History", "history"),
          makeOption("Detail", "detail"),
          makeOption("Versions", "versions"),
          makeOption("Columns", "columns"),
        ]}
      />
    </BG>
  )
}

function Container({children}) {
  const width = useSelector(Layout.getDetailPaneWidth)
  const dispatch = useDispatch()
  const isOpen = useSelector(Layout.getDetailPaneIsOpen)

  const onDrag = (e: React.MouseEvent) => {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    dispatch(Layout.setDetailPaneWidth(Math.min(width, max)))
  }

  if (!isOpen) return null

  return (
    // @ts-ignore
    <Pane onDrag={onDrag} dragAnchor="left" style={{width}}>
      {children}
    </Pane>
  )
}

const RightPane = () => {
  const currentPaneName = useSelector(Layout.getCurrentPaneName)

  return (
    <Container>
      <Menu />
      <AppErrorBoundary>
        <PaneContentSwitch paneName={currentPaneName} />
      </AppErrorBoundary>
    </Container>
  )
}

export default RightPane
