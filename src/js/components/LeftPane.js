/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import {XLeftPaneCollapser} from "./LeftPaneCollapser"
import {XLeftPaneExpander} from "./LeftPaneExpander"
import FilterTree from "./FilterTree"
import InvestigationLinear from "./Investigation/InvestigationLinear"
import Pane from "./Pane"
import Layout from "../state/Layout"
import styled from "styled-components"
import usePopupMenu from "./hooks/usePopupMenu"
import DropdownArrow from "../icons/DropdownArrow"

const Arrow = (props) => {
  return (
    <svg className={props.className} onClick={props.onClick} viewBox="0 0 8 8">
      <polygon points="0 0 8 4 0 8" />
    </svg>
  )
}

const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.coconut};
  height: 24px;
  align-items: center;
  justify-content: flex-start;
  border-top: 1px solid ${(props) => props.theme.colors.cloudy};
  border-bottom: 1px solid ${(props) => props.theme.colors.cloudy};
`

const Title = styled.label`
  margin-left: 5px;

  ${(props) => props.theme.typography.headingList}
`

const StyledArrow = styled(Arrow)`
  fill: ${(props) => props.theme.colors.lead};
  width: 8px;
  margin-left: 12px;
  transform: ${(props) => (props.show ? `rotate(90deg)` : "")};
  transition: transform 150ms;
  cursor: pointer;
`

const StyledViewSelect = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: 15px;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  text-transform: capitalize;
  color: ${(props) => props.theme.colors.slate};
  ${(props) => props.theme.typography.labelSmall}

  svg {
    stroke: ${(props) => props.theme.colors.slate};
    margin-left: 5px;
  }
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
  const [showCollapse, setShowCollapse] = useState(true)
  const [showHistory, setShowHistory] = useState(true)
  const view = useSelector(Layout.getInvestigationView)
  const isOpen = useSelector(Layout.getLeftSidebarIsOpen)
  const width = useSelector(Layout.getLeftSidebarWidth)
  const dispatch = useDispatch()

  function onDrag(e: MouseEvent) {
    const width = e.clientX
    const max = global.innerWidth
    dispatch(Layout.setLeftSidebarWidth(Math.min(width, max)))
  }

  if (!isOpen) return <XLeftPaneExpander />

  return (
    <Pane
      isOpen={isOpen}
      position="left"
      width={width}
      onDrag={onDrag}
      className="history-pane"
      onMouseEnter={() => setShowCollapse(true)}
      onMouseLeave={() => setShowCollapse(false)}
    >
      <section>
        <SectionHeader>
          <StyledArrow
            onClick={() => setShowHistory(!showHistory)}
            show={showHistory}
          />
          <Title>History</Title>
          <ViewSelect />
        </SectionHeader>
        {showHistory && <InvestigationView view={view} />}
      </section>
      <XLeftPaneCollapser show={showCollapse} />
    </Pane>
  )
}
