import get from "lodash/get"
import React, {MouseEvent} from "react"
import {useDispatch, useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import styled from "styled-components"
import Current from "src/js/state/Current"
import Pane from "src/js/components/Pane"
import {XLeftPaneExpander} from "./left-pane-expander"
import PoolsSection from "./pools-section"
import QueriesSection from "./queries-section"
import Header from "./header"
import {Menu} from "./menu"

const EmptyText = styled.div`
  ${(p) => p.theme.typography.labelNormal}
  color: var(--slate);
  margin-top: 110px;
  padding: 0 24px;
  text-align: center;
`

const SectionContentSwitch = ({sectionName}) => {
  switch (sectionName) {
    case "pools":
      return <PoolsSection />
    case "queries":
      return <QueriesSection />
    default:
      return null
  }
}

const StyledPane = styled(Pane)`
  background: var(--sidebar-background);
  overflow-x: unset;
  padding-top: 40px;
`

export function Sidebar() {
  const dispatch = useDispatch()
  const isOpen = useSelector(Appearance.sidebarIsOpen)
  const width = useSelector(Appearance.sidebarWidth)
  const currentSectionName = useSelector(Appearance.getCurrentSectionName)
  const l = useSelector(Current.getLake)

  const id = get(l, ["id"], "")
  function onDragPane(e: MouseEvent) {
    const width = e.clientX
    const max = window.innerWidth
    dispatch(Appearance.resizeSidebar(Math.min(width, max)))
  }

  if (!isOpen) return <XLeftPaneExpander />

  return (
    <StyledPane
      isOpen={isOpen}
      position="left"
      width={width}
      onDrag={onDragPane}
      aria-label="sidebar"
    >
      {!id ? (
        <EmptyText>The lake previously on this tab has been removed.</EmptyText>
      ) : (
        <>
          <Header />
          <Menu />
          <SectionContentSwitch sectionName={currentSectionName} />
        </>
      )}
    </StyledPane>
  )
}
