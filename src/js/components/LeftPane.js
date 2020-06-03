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
      <InvestigationTitleBar onClearAll={onClearAll} />
      <div className="investigation-pane-body">
        <InvestigationHeader
          view={view}
          onViewChange={onViewChange}
          onClearAll={onClearAll}
        />
        <InvestigationView view={view} />
      </div>

      <XLeftPaneCollapser show={showCollapse} />
    </Pane>
  )
}

function InvestigationTitleBar() {
  return (
    <PaneHeader>
      <Left />
      <Center>
        <PaneTitle>History</PaneTitle>
      </Center>
      <Right />
    </PaneHeader>
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
