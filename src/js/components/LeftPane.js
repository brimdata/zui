/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"

import {Header} from "./Typography"
import {XLeftPaneCollapser} from "./LeftPaneCollapser"
import {XLeftPaneExpander} from "./LeftPaneExpander"
import {clearInvestigation, setLeftSidebarWidth} from "../state/actions"
import {getLeftSidebarIsOpen, getLeftSidebarWidth} from "../state/reducers/view"
import HistoryAside from "./HistoryAside"
import Pane, {PaneHeader, PaneTitle, Left, Right, Center} from "./Pane"

export function LeftPane() {
  let [showCollapse, setShowCollapse] = useState(true)
  let isOpen = useSelector(getLeftSidebarIsOpen)
  let width = useSelector(getLeftSidebarWidth)
  let dispatch = useDispatch()

  function onDrag(e: MouseEvent) {
    const width = e.clientX
    const max = window.innerWidth
    dispatch(setLeftSidebarWidth(Math.min(width, max)))
  }

  function onClearAll() {
    dispatch(clearInvestigation)
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
      <InvestigationHeader />
      <HistoryAside />

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

function InvestigationHeader() {
  return null
}
