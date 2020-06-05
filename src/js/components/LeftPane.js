/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import {LinkButton} from "./Typography"
import {XLeftPaneCollapser} from "./LeftPaneCollapser"
import {XLeftPaneExpander} from "./LeftPaneExpander"
import {globalDispatch} from "../state/GlobalContext"
import FilterTree from "./FilterTree"
import Investigation from "../state/Investigation"
import InvestigationLinear from "./Investigation/InvestigationLinear"
import Pane, {PaneHeader, PaneTitle, Left, Right, Center} from "./Pane"
import Layout from "../state/Layout"
import BookIcon from "../icons/BookSvgIcon"
import styled from "styled-components"

type DropdownSectionProps = {
  title: string,
  Icon: React$ComponentType,
  show: boolean,
  children: *
}

const DropdownArrow = ({className}) => {
  return (
    <svg className={className} viewBox="0 0 18 12">
      <polygon points="18 6 0 12 2.66453526e-15 0" />
    </svg>
  )
}

const StyledDropdownArrow = styled(DropdownArrow)`
  fill: $gray;
  width: 10px;
  transform: ${(props) => (props.show ? `rotate(90deg)` : "")};
`

const DropdownSection = ({title, Icon, children}: DropdownSectionProps) => {
  const [show, setShow] = useState(true)

  const onClick = () => {
    setShow(!show)
  }

  return (
    <section>
      <div onClick={onClick}>
        <StyledDropdownArrow show={show} />
        <Icon />
        <span>{title}</span>
      </div>
      {show && children}
    </section>
  )
}

export function LeftPane() {
  let [showCollapse, setShowCollapse] = useState(true)
  let view = useSelector(Layout.getInvestigationView)
  let isOpen = useSelector(Layout.getLeftSidebarIsOpen)
  let width = useSelector(Layout.getLeftSidebarWidth)
  let dispatch = useDispatch()

  function onDrag(e: MouseEvent) {
    const width = e.clientX
    const max = global.innerWidth
    dispatch(Layout.setLeftSidebarWidth(Math.min(width, max)))
  }

  function onViewChange(name) {
    dispatch(Layout.setInvestigationView(name))
  }

  function onClearAll() {
    globalDispatch(Investigation.clearInvestigation())
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
      <DropdownSection title="HISTORY" Icon={BookIcon} show={false}>
        <div className="investigation-pane-body">
          <InvestigationHeader
            view={view}
            onViewChange={onViewChange}
            onClearAll={onClearAll}
          />
          <InvestigationView view={view} />
        </div>
      </DropdownSection>
      <XLeftPaneCollapser show={showCollapse} />
    </Pane>
  )
}

function InvestigationHeader({view, onViewChange, onClearAll}) {
  function treeView() {
    onViewChange("tree")
  }

  function linearView() {
    onViewChange("linear")
  }

  return (
    <header className="investigation-header">
      <nav className="investigation-view-options">
        <LinkButton
          className={classNames({selected: view === "tree"})}
          onClick={treeView}
        >
          Tree
        </LinkButton>
        <LinkButton
          className={classNames({selected: view === "linear"})}
          onClick={linearView}
        >
          Linear
        </LinkButton>
      </nav>
      <LinkButton onClick={onClearAll}>Clear</LinkButton>
    </header>
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
