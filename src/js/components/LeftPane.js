/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import {Code, Header, LinkButton} from "./Typography"
import {XFilterTree} from "./FilterTree"
import {XLeftPaneCollapser} from "./LeftPaneCollapser"
import {XLeftPaneExpander} from "./LeftPaneExpander"
import {clearInvestigation, setLeftSidebarWidth} from "../state/actions"
import {getLeftSidebarIsOpen, getLeftSidebarWidth} from "../state/reducers/view"
import Pane, {PaneHeader, PaneTitle, Left, Right, Center} from "./Pane"

export function LeftPane() {
  let [showCollapse, setShowCollapse] = useState(true)
  let [view, setView] = useState("tree")
  let isOpen = useSelector(getLeftSidebarIsOpen)
  let width = useSelector(getLeftSidebarWidth)
  let dispatch = useDispatch()

  function onDrag(e: MouseEvent) {
    const width = e.clientX
    const max = window.innerWidth
    dispatch(setLeftSidebarWidth(Math.min(width, max)))
  }

  function onViewChange(name) {
    setView(name)
  }

  function onClearAll() {
    dispatch(clearInvestigation())
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
      <InvestigationHeader view={view} onViewChange={onViewChange} />
      <InvestigationView view={view} />

      <XLeftPaneCollapser show={showCollapse} />
    </Pane>
  )
}

function InvestigationTitleBar({onClearAll}) {
  return (
    <PaneHeader>
      <Left />
      <Center>
        <PaneTitle>Investigation</PaneTitle>
      </Center>
      <Right>
        <button onClick={onClearAll} className="panel-button clear-button">
          CLEAR
        </button>
      </Right>
    </PaneHeader>
  )
}

function InvestigationHeader({view, onViewChange}) {
  function treeView() {
    onViewChange("tree")
  }

  function linearView() {
    onViewChange("linear")
  }

  return (
    <header className="investigation-header">
      <Header white-1>Name</Header>
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
  return <XFilterTree />
}

function InvestigationLinear() {
  return (
    <Code light white>
      Linear investigation here
    </Code>
  )
}
