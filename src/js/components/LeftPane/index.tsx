import get from "lodash/get"
import React, {MouseEvent} from "react"
import {useDispatch, useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import styled from "styled-components"
import {Sectional} from "../../../pkg/sectional"
import Current from "../../state/Current"
import WorkspacePicker from "../WorkspacePicker"
import Pane from "./../Pane"
import HistorySection from "./HistorySection"
import {XLeftPaneExpander} from "./LeftPaneExpander"
import PoolsSection from "./PoolsSection"
import QueriesSection from "./QueriesSection"

const EmptyText = styled.div`
  ${(p) => p.theme.typography.labelNormal}
  color: var(--slate);
  margin-top: 110px;
  padding: 0 24px;
  text-align: center;
`

export function LeftPane() {
  const dispatch = useDispatch()
  const isOpen = useSelector(Appearance.sidebarIsOpen)
  const width = useSelector(Appearance.sidebarWidth)
  const sections = useSelector(Appearance.sidebarSections).map((s) => ({
    ...s,
    min: 100,
    closedSize: 24
  }))

  const ws = useSelector(Current.getWorkspace)
  const id = get(ws, ["id"], "")
  const setSections = (sections) =>
    dispatch(Appearance.updateSidebarSections(sections))

  function onDragPane(e: MouseEvent) {
    const width = e.clientX
    const max = window.innerWidth
    dispatch(Appearance.resizeSidebar(Math.min(width, max)))
  }

  if (!isOpen) return <XLeftPaneExpander />

  return (
    <Pane
      isOpen={isOpen}
      position="left"
      width={width}
      onDrag={onDragPane}
      className="history-pane"
      aria-label="sidebar"
    >
      {!id ? (
        <EmptyText>The lake previously on this tab has been removed.</EmptyText>
      ) : (
        <>
          <WorkspacePicker />
          <Sectional sections={sections} onChange={setSections}>
            {(data, provided) => {
              if (data.id === "pools")
                return (
                  <PoolsSection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              if (data.id === "queries")
                return (
                  <QueriesSection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              if (data.id === "history")
                return (
                  <HistorySection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              return null
            }}
          </Sectional>
        </>
      )}
    </Pane>
  )
}
