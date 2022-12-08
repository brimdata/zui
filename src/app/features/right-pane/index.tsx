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
  const onChange = (name: string) =>
    dispatch(Layout.setCurrentPaneName(name as PaneName))
  return (
    <BG>
      <SectionTabs
        value={currentPaneName}
        onChange={onChange}
        options={[
          {label: "History", value: "history"},
          {label: "Detail", value: "detail"},
          {label: "Versions", value: "versions"},
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
