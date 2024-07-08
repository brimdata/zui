import React from "react"
import DetailSection from "./detail-section"

import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {DraggablePane} from "src/js/components/draggable-pane"
import VersionsSection from "./versions-section"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import {HistorySection} from "./history/section"
import {ColumnsPane} from "src/views/columns-pane"
import Appearance from "src/js/state/Appearance"
import Current from "src/js/state/Current"
import {CorrelationsPane} from "../correlations-pane"
import {Header} from "./header"
import {RightPaneHandler} from "./right-pane-handler"
import {DetailPane} from "../detail-pane"

function Contents() {
  switch (useSelector(Layout.getCurrentPaneName)) {
    case "detail":
      return <DetailPane />
    case "versions":
      return <VersionsSection />
    case "history":
      return <HistorySection />
    case "columns":
      return <ColumnsPane />
    case "correlations":
      return <CorrelationsPane />
    default:
      return null
  }
}

export default function RightPane() {
  const isOpen = useSelector(Appearance.secondarySidebarIsOpen)
  const tab = useSelector(Current.getTabId)
  const handler = new RightPaneHandler()
  if (!tab && isOpen) return null

  return (
    <DraggablePane
      onDrag={(e) => handler.onDrag(e)}
      dragAnchor="left"
      className="stack border-more"
      style={{gridArea: "secondary-sidebar"}}
    >
      <Header />
      <AppErrorBoundary>
        <Contents />
      </AppErrorBoundary>
    </DraggablePane>
  )
}
