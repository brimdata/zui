import React from "react"
import DetailSection from "./detail-section"

import styled from "styled-components"
import {useDispatch} from "src/app/core/state"
import {useSelector} from "react-redux"
import {XRightPaneExpander} from "../../../js/components/RightPaneExpander"
import Layout from "../../../js/state/Layout"
import Pane from "../../../js/components/Pane"
import VersionsSection from "./versions-section"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import {HistorySection} from "./history/section"

const BG = styled.div`
  display: flex;
  padding: 0 6px;
  align-items: center;
  box-shadow: 0 1px 0px var(--cloudy);
  height: 28px;
  flex-shrink: 0;
  user-select: none;
  position: relative;

  button {
    background: none;
    border: none;
    display: flex;

    border-radius: 5px;
    padding: 0 6px;
    text-transform: uppercase;

    span {
      height: 100%;
      display: flex;
      align-items: center;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      padding: 7px 4px 3px 4px;
      font-size: 11px;
      opacity: 0.5;
    }

    &:hover {
      span {
        opacity: 0.7;
        transition: opacity 0.2s;
      }
    }

    &:active {
      span {
        opacity: 0.8;
      }
    }

    &[aria-pressed="true"] {
      span {
        opacity: 1;
        border-bottom: 2px solid var(--primary-color);
      }
    }
  }
`

const PaneContentSwitch = ({paneName}) => {
  switch (paneName) {
    case "detail":
      return <DetailSection />
    case "versions":
      return <VersionsSection />
    case "history":
      return <HistorySection />
    default:
      return null
  }
}

export function Menu() {
  const dispatch = useDispatch()
  const currentPaneName = useSelector(Layout.getCurrentPaneName)
  const onClick = (name) => () => dispatch(Layout.setCurrentPaneName(name))
  return (
    <BG>
      <button
        onClick={onClick("history")}
        aria-pressed={currentPaneName === "history"}
      >
        <span>History</span>
      </button>
      <button
        onClick={onClick("detail")}
        aria-pressed={currentPaneName === "detail"}
      >
        <span>Detail</span>
      </button>
      <button
        onClick={onClick("versions")}
        aria-pressed={currentPaneName === "versions"}
      >
        <span>Versions</span>
      </button>
    </BG>
  )
}

const RightPane = () => {
  const dispatch = useDispatch()
  const currentPaneName = useSelector(Layout.getCurrentPaneName)
  const isOpen = useSelector(Layout.getDetailPaneIsOpen)
  const width = useSelector(Layout.getDetailPaneWidth)

  const onDrag = (e: MouseEvent) => {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    dispatch(Layout.setDetailPaneWidth(Math.min(width, max)))
  }

  if (!isOpen) return <XRightPaneExpander />
  return (
    <Pane
      isOpen={isOpen}
      onDrag={onDrag}
      position="right"
      width={width}
      className="right-pane"
      aria-label="details"
    >
      <Menu />
      <AppErrorBoundary>
        <PaneContentSwitch paneName={currentPaneName} />
      </AppErrorBoundary>
    </Pane>
  )
}

export default RightPane
