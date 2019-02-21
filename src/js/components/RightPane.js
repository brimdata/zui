/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import {type DispatchProps} from "../reducers/types"
import type {Space} from "../lib/Space"
import {XLogDetailPane} from "./LogDetailPane"
import {XRightPaneCollapser} from "./RightPaneCollapser"
import {XRightPaneExpander} from "./RightPaneExpander"
import {backLogDetail, forwardLogDetail} from "../actions/logDetails"
import {fetchPackets} from "../actions/packets"
import {open} from "../lib/System"
import {setRightSidebarWidth} from "../actions/view"
import {starLog, unstarLog} from "../actions/starredLogs"
import Back from "../icons/back-arrow.svg"
import Forward from "../icons/forward-arrow.svg"
import Log from "../models/Log"
import Pane, {
  PaneHeader,
  PaneTitle,
  Left,
  Right,
  Center,
  PaneBody
} from "./Pane"
import Star from "../icons/star-sm.svg"
import dispatchToProps from "../lib/dispatchToProps"
import * as logDetails from "../selectors/logDetails"
import * as spaces from "../reducers/spaces"
import * as view from "../reducers/view"

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
        onMouseEnter={() => {
          this.setState({showCollapse: true})
        }}
        onMouseLeave={() => {
          this.setState({showCollapse: false})
        }}
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
        <XRightPaneCollapser show={this.state.showCollapse} />
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
