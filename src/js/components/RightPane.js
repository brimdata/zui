/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {DispatchProps} from "../state/types"
import type {Space} from "../state/Spaces/types"
import {XRightPaneExpander} from "./RightPaneExpander"
import {downloadPcap} from "../flows/downloadPcap"
import Back from "./icons/back-arrow.svg"
import Forward from "./icons/forward-arrow.svg"
import Layout from "../state/Layout"
import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import LogDetailsComponent from "./LogDetails"
import PacketsButton from "./PacketsButton"
import Pane, {
  PaneHeader,
  PaneTitle,
  Left,
  Right,
  Center,
  PaneBody
} from "./Pane"
import RightPaneCollapser from "./RightPaneCollapser"
import Tab from "../state/Tab"
import dispatchToProps from "../lib/dispatchToProps"

type StateProps = {|
  currentLog: Log,
  prevExists: boolean,
  nextExists: boolean,
  isOpen: boolean,
  width: number,
  space: Space
|}

type Props = {|...StateProps, ...DispatchProps|}

type S = {
  showCollapse: boolean
}

export default class RightPane extends React.Component<Props, S> {
  state = {showCollapse: true}

  onDrag = (e: MouseEvent) => {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    this.props.dispatch(Layout.setRightSidebarWidth(Math.min(width, max)))
  }

  onPacketsClick = () => {
    this.props.dispatch(downloadPcap(this.props.currentLog))
  }

  render() {
    const {prevExists, nextExists, isOpen, width, currentLog} = this.props
    if (!this.props.space) return null
    if (!isOpen) return <XRightPaneExpander />
    return (
      <Pane
        isOpen={isOpen}
        onDrag={this.onDrag}
        position="right"
        width={width}
        className="log-detail-pane"
      >
        {currentLog && (
          <PaneHeader>
            <Left>
              <div className="history-buttons">
                <button
                  className="panel-button back-button"
                  disabled={!prevExists}
                  onClick={() => this.props.dispatch(LogDetails.back())}
                >
                  <Back />
                </button>
                <button
                  className="panel-button forward-button"
                  onClick={() => this.props.dispatch(LogDetails.forward())}
                  disabled={!nextExists}
                >
                  <Forward />
                </button>
              </div>
            </Left>
            <Center>
              <PaneTitle>Log Details</PaneTitle>
            </Center>
            <Right>
              <div className="toolbar">
                <PacketsButton label={false} id="detail-packets" />
              </div>
            </Right>
          </PaneHeader>
        )}
        <PaneBody>
          <LogDetailsComponent />
        </PaneBody>
        <RightPaneCollapser />
      </Pane>
    )
  }
}

const stateToProps = (state) => ({
  isOpen: Layout.getRightSidebarIsOpen(state),
  width: Layout.getRightSidebarWidth(state),
  prevExists: LogDetails.getHistory(state).prevExists(),
  nextExists: LogDetails.getHistory(state).nextExists(),
  currentLog: LogDetails.build(state),
  space: Tab.space(state)
})

export const XRightPane = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(RightPane)
