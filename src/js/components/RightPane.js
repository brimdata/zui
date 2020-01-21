/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import type {DispatchProps} from "../state/types"
import type {Space} from "../state/Spaces/types"
import {XRightPaneExpander} from "./RightPaneExpander"
import {fetchPackets} from "../state/thunks/packets"
import {open} from "../lib/System"
import {reactElementProps} from "../test/integration"
import {setRightSidebarWidth, starLog, unstarLog} from "../state/actions"
import Back from "./icons/back-arrow.svg"
import Forward from "./icons/forward-arrow.svg"
import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import LogDetailsComponent from "./LogDetails"
import Pane, {
  PaneHeader,
  PaneTitle,
  Left,
  Right,
  Center,
  PaneBody
} from "./Pane"
import RightPaneCollapser from "./RightPaneCollapser"
import Star from "./icons/star-sm.svg"
import Tab from "../state/Tab"
import dispatchToProps from "../lib/dispatchToProps"
import * as view from "../state/reducers/view"

type StateProps = {|
  isStarred: boolean,
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

  toggleStar = () => {
    this.props.isStarred
      ? this.props.dispatch(unstarLog(this.props.currentLog.tuple))
      : this.props.dispatch(starLog(this.props.currentLog.tuple))
  }

  onDrag = (e: MouseEvent) => {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    this.props.dispatch(setRightSidebarWidth(Math.min(width, max)))
  }

  onPacketsClick = () => {
    this.props.dispatch(fetchPackets(this.props.currentLog)).then(open)
  }

  render() {
    const {
      prevExists,
      nextExists,
      isOpen,
      width,
      isStarred,
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
                  onClick={() =>
                    this.props.dispatch(LogDetails.backLogDetail())
                  }
                >
                  <Back />
                </button>
                <button
                  className="panel-button forward-button"
                  onClick={() =>
                    this.props.dispatch(LogDetails.forwardLogDetail())
                  }
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
              <button
                className={classNames("panel-button", "star-button", {
                  starred: isStarred
                })}
                onClick={this.toggleStar}
              >
                <Star />
              </button>
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
  isOpen: view.getRightSidebarIsOpen(state),
  width: view.getRightSidebarWidth(state),
  prevExists: LogDetails.getLogDetailHistory(state).prevExists(),
  nextExists: LogDetails.getLogDetailHistory(state).nextExists(),
  isStarred: LogDetails.getLogDetailIsStarred(state),
  currentLog: LogDetails.buildLogDetail(state),
  space: Tab.space(state)
})

export const XRightPane = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(RightPane)
