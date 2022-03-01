import get from "lodash/get"
import React, {MouseEvent} from "react"
import {useDispatch, useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import styled from "styled-components"
import Current from "src/js/state/Current"
import Pane from "src/js/components/Pane"
import HistorySection from "./history-section"
import {XLeftPaneExpander} from "./left-pane-expander"
import PoolsSection from "./pools-section"
import QueriesSection from "./queries-section"
import Icon from "src/app/core/Icon"
import {ItemBG, Name, StyledItem} from "./common"
import LakePicker from "./lake-picker"
import {useSectionTreeDefaults} from "./hooks"
import classNames from "classnames"
import {Tree} from "react-arborist"

const EmptyText = styled.div`
  ${(p) => p.theme.typography.labelNormal}
  color: var(--slate);
  margin-top: 110px;
  padding: 0 24px;
  text-align: center;
`

export const StyledMenu = styled.menu`
  height: 110px;
  margin: 0 0 6px;
  padding: 0;
`

const StyledListItem = styled(StyledItem)<{isSelected: boolean}>`
  text-transform: capitalize;
  user-select: none;
  ${({isSelected}) =>
    isSelected &&
    `
  outline: none;
  background-color: var(--sidebar-item-active);
  &:hover {
    background-color: var(--sidebar-item-active);
  }
  `}

  svg {
    margin-right: 8px;
    width: 14px;
    height: 14px;

    path {
      fill: rgba(0, 0, 0, 0.5);
    }
  }
`

const SidebarItem = ({innerRef, styles, data, state}) => {
  const dispatch = useDispatch()
  const currentSectionName = useSelector(Appearance.getCurrentSectionName)
  const {icon, name} = data
  const isCurrent = name === currentSectionName
  return (
    <ItemBG
      tabIndex={0}
      ref={innerRef}
      style={styles.row}
      className={classNames(state)}
      onClick={() => dispatch(Appearance.setCurrentSectionName(name))}
    >
      <StyledListItem isSelected={isCurrent}>
        {icon}
        <Name>{name}</Name>
      </StyledListItem>
    </ItemBG>
  )
}

const SectionContentSwitch = ({sectionName}) => {
  switch (sectionName) {
    case "pools":
      return <PoolsSection />
    case "queries":
      return <QueriesSection />
    case "history":
      return <HistorySection />
    default:
      return null
  }
}

const sectionListItems = {
  id: "root",
  items: [
    {
      name: "pools",
      icon: <Icon name="pool" />
    },
    {
      name: "queries",
      icon: <Icon name="doc-plain" />
    },
    {
      name: "history",
      icon: <Icon name="history" />
    }
  ]
}

const StyledPane = styled(Pane)`
  background: var(--sidebar-background);
  overflow-x: unset;
`

export function Sidebar() {
  const dispatch = useDispatch()
  const isOpen = useSelector(Appearance.sidebarIsOpen)
  const width = useSelector(Appearance.sidebarWidth)
  const {resizeRef, defaults} = useSectionTreeDefaults()
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
          <LakePicker />
          <StyledMenu ref={resizeRef}>
            <Tree {...defaults} data={sectionListItems}>
              {SidebarItem}
            </Tree>
          </StyledMenu>
          <SectionContentSwitch sectionName={currentSectionName} />
        </>
      )}
    </StyledPane>
  )
}
