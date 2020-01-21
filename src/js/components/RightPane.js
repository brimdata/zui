/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {DispatchProps} from "../state/types"
import type {Space} from "../state/Spaces/types"
import {XRightPaneExpander} from "./RightPaneExpander"
import {open} from "../lib/System"
import {reactElementProps} from "../test/integration"
import Back from "./icons/back-arrow.svg"
import Forward from "./icons/forward-arrow.svg"
import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import LogDetailsComponent from "./LogDetails"
import Packets from "../state/Packets"
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
import View from "../state/View"
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
    this.props.dispatch(View.setRightSidebarWidth(Math.min(width, max)))
  }

  onPacketsClick = () => {
    this.props.dispatch(Packets.fetch(this.props.currentLog)).then(open)
  }

  render() {
    const {
      prevExists,
      nextExists,
      isOpen,
      width,
      currentLog,
      space
    } = this.props
    const packetsAvailable =
      currentLog && currentLog.isPath("conn") && space && space.packet_support

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
              {packetsAvailable && (
                <button
                  className="panel-button text"
                  onClick={this.onPacketsClick}
                  {...reactElementProps("pcapsButton")}
                >
                  PCAPS
                </button>
              )}
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
  isOpen: View.getRightSidebarIsOpen(state),
  width: View.getRightSidebarWidth(state),
  prevExists: LogDetails.getHistory(state).prevExists(),
  nextExists: LogDetails.getHistory(state).nextExists(),
  currentLog: LogDetails.build(state),
  space: Tab.space(state)
})

export const XRightPane = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(RightPane)
