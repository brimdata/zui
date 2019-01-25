/* @flow */

import React from "react"
import Pane, {
  PaneHeader,
  PaneTitle,
  Left,
  Right,
  Center,
  PaneBody
} from "./Pane"
import Star from "../icons/star-sm.svg"
import Back from "../icons/back-arrow.svg"
import Forward from "../icons/forward-arrow.svg"
import classNames from "classnames"
import {XLogDetailPane} from "./LogDetailPane"
import Log from "../models/Log"
import type {Space} from "../lib/Space"
import {connect} from "react-redux"
import * as view from "../reducers/view"
import * as logDetails from "../selectors/logDetails"
import * as spaces from "../reducers/spaces"
import dispatchToProps from "../lib/dispatchToProps"
import {type DispatchProps} from "../reducers/types"
import {unstarLog} from "../actions/starredLogs"
import {starLog} from "../actions/starredLogs"
import {setRightSidebarWidth} from "../actions/view"
import {fetchPackets} from "../actions/packets"
import {backLogDetail} from "../actions/logDetails"
import {forwardLogDetail} from "../actions/logDetails"

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

export default class RightPane extends React.Component<Props> {
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
    this.props.dispatch(fetchPackets(this.props.currentLog))
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
                  onClick={() => this.props.dispatch(backLogDetail())}
                >
                  <Back />
                </button>
                <button
                  className="panel-button forward-button"
                  onClick={() => this.props.dispatch(forwardLogDetail())}
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
          <XLogDetailPane />
        </PaneBody>
      </Pane>
    )
  }
}

const stateToProps = state => ({
  isOpen: view.getRightSidebarIsOpen(state),
  width: view.getRightSidebarWidth(state),
  prevExists: logDetails.getLogDetailHistory(state).prevExists(),
  nextExists: logDetails.getLogDetailHistory(state).nextExists(),
  isStarred: logDetails.getLogDetailIsStarred(state),
  currentLog: logDetails.buildLogDetail(state),
  space: spaces.getCurrentSpace(state)
})

export const XRightPane = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(RightPane)
