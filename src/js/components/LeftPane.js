/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useRef} from "react"
import styled from "styled-components"

import {XLeftPaneExpander} from "./LeftPaneExpander"
import AddSpaceButton from "./AddSpaceButton"
import ClusterPicker from "./ClusterPicker"
import Current from "../state/Current"
import DropdownArrow from "../icons/DropdownArrow"
import FilterTree from "./FilterTree"
import InvestigationLinear from "./Investigation/InvestigationLinear"
import Layout from "../state/Layout"
import Pane from "./Pane"
import SavedSpacesList from "./SavedSpacesList"
import Spaces from "../state/Spaces"
import menu from "../electron/menu"
import useDrag from "./hooks/useDrag"
import usePopupMenu from "./hooks/usePopupMenu"

const Arrow = (props) => {
  return (
    <svg className={props.className} onClick={props.onClick} viewBox="0 0 8 8">
      <polygon points="0 0 8 4 0 8" />
    </svg>
  )
}

const StyledSection = styled.section`
  overflow: hidden;
  position: relative;
  min-height: 24px;
  flex-basis: 0%;
  flex-shrink: 1;
  padding-bottom: 24px;
`

const SectionContents = styled.div`
  height: 100%;
  display: ${(props) => (props.show ? "block" : "none")};
  overflow-y: auto;
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--coconut);
  height: 24px;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 1px;
    box-shadow: inset 0 0.5px 0 0 var(--cloudy);
  }

  &::after {
    top: unset;
    bottom: 0;
    box-shadow: inset 0 -0.5px 0 0 var(--cloudy);
  }
`

const Title = styled.label`
  margin-left: 8px;
  line-height: 24px;

  ${(props) => props.theme.typography.headingList}
`

const StyledArrow = styled(Arrow)`
  fill: var(--aqua);
  opacity: 0.3;
  width: 8px;
  height: 8px;
  margin-left: 12px;
  transform: ${(props) => (props.show ? `rotate(90deg)` : "")};
  transition: transform 150ms;
`

const ClickRegion = styled.div`
  display: flex;
  align-items: center;
`

const StyledViewSelect = styled.div`
  ${(props) => props.theme.typography.labelSmall}
  ${(props) => props.theme.hoverQuiet}
  display: flex;
  margin-left: auto;
  margin-right: 8px;
  height: 18px;
  padding: 0 8px;
  line-height: 24px;
  flex-direction: row;
  align-items: center;
  text-transform: capitalize;
  border-radius: 3px;
  color: var(--slate);

  svg {
    stroke: var(--slate);
    margin-left: 6px;
    height: 8px;
    width: 8px;
  }
`

const DragAnchor = styled.div`
  position: absolute;
  background: transparent;
  pointer-events: all !important;
  width: 100%;
  height: 9px;
  bottom: -4px;
  top: unset;
  cursor: row-resize;
`

const ViewSelect = () => {
  const dispatch = useDispatch()
  const currentView = useSelector(Layout.getInvestigationView)
  const template = [
    {
      label: "Linear",
      click: () => dispatch(Layout.setInvestigationView("linear"))
    },
    {
      label: "Tree",
      click: () => dispatch(Layout.setInvestigationView("tree"))
    }
  ]

  const openMenu = usePopupMenu(template)

  const onClick = (e) => {
    openMenu(e.currentTarget)
  }

  return (
    <StyledViewSelect onClick={onClick}>
      {currentView}
      <DropdownArrow />
    </StyledViewSelect>
  )
}

function InvestigationView({view}) {
  switch (view) {
    case "tree":
      return <InvestigationTree />
    case "linear":
      return <InvestigationLinear />
    default:
      return null
  }
}

function InvestigationTree() {
  return <FilterTree />
}

export function LeftPane() {
  const dispatch = useDispatch()

  const view = useSelector(Layout.getInvestigationView)
  const isOpen = useSelector(Layout.getLeftSidebarIsOpen)
  const width = useSelector(Layout.getLeftSidebarWidth)
  const id = useSelector(Current.getConnectionId)
  const spaces = useSelector(Spaces.getSpaces(id))
  const spaceContextMenu = menu.spaceContextMenu(id)

  const showHistory = useSelector(Layout.getHistoryIsOpen)
  const showSpaces = useSelector(Layout.getSpacesIsOpen)
  const historyHeight = useSelector(Layout.getHistoryHeight)
  const spacesHeight = useSelector(Layout.getSpacesHeight)

  const paneRef = useRef()
  const paneHeight = useRef(0)

  if (!id) return null

  function onDragPane(e: MouseEvent) {
    const width = e.clientX
    const max = global.innerWidth
    dispatch(Layout.setLeftSidebarWidth(Math.min(width, max)))
  }

  function onDragSpaces({dy, type}) {
    let newSpacesHeight
    switch (type) {
      case "down":
        document.body && (document.body.style.cursor = "row-resize")
        paneHeight.current = paneRef.current
          ? paneRef.current.getBoundingClientRect().height
          : 0
        break
      case "move":
        newSpacesHeight = spacesHeight + dy / (paneHeight.current / 2)
        dispatch(Layout.setSpacesHeight(newSpacesHeight))
        dispatch(Layout.setHistoryHeight(2 - newSpacesHeight))
        break
      case "up":
        document.body && (document.body.style.cursor = "")
    }
  }

  const dragFunc = useDrag(onDragSpaces)

  if (!isOpen) return <XLeftPaneExpander />

  return (
    <Pane
      isOpen={isOpen}
      position="left"
      width={width}
      ref={paneRef}
      onDrag={onDragPane}
      className="history-pane"
    >
      <ClusterPicker />
      <StyledSection style={{flexGrow: showSpaces ? spacesHeight : 0}}>
        <SectionHeader>
          <ClickRegion onClick={() => dispatch(Layout.toggleSpaces())}>
            <StyledArrow show={showSpaces} />
            <Title>Spaces</Title>
          </ClickRegion>
          <AddSpaceButton />
        </SectionHeader>
        <SectionContents show={showSpaces}>
          <SavedSpacesList
            spaces={spaces}
            spaceContextMenu={spaceContextMenu}
          />
        </SectionContents>
        {showSpaces && <DragAnchor {...dragFunc()} />}
      </StyledSection>
      <StyledSection style={{flexGrow: historyHeight}}>
        <SectionHeader>
          <ClickRegion onClick={() => dispatch(Layout.toggleHistory())}>
            <StyledArrow show={showHistory} />
            <Title>History</Title>
          </ClickRegion>
          <ViewSelect />
        </SectionHeader>
        <SectionContents show={showHistory}>
          <InvestigationView view={view} />
        </SectionContents>
      </StyledSection>
    </Pane>
  )
}
