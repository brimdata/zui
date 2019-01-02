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
import XLogDetail from "../connectors/XLogDetail"

export default class RightPane extends React.Component {
  constructor(props) {
    super(props)
    this.onDrag = this.onDrag.bind(this)
    this.onPacketsClick = this.onPacketsClick.bind(this)
    this.toggleStar = () =>
      this.props.isStarred
        ? this.props.unstarLog(this.props.currentLog.tuple)
        : this.props.starLog(this.props.currentLog.tuple)
  }

  onDrag(e) {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    this.props.setRightSidebarWidth(Math.min(width, max))
  }

  onPacketsClick() {
    this.props.fetchPackets(this.props.currentLog)
  }

  render() {
    const {
      prevExists,
      backLogDetail,
      nextExists,
      forwardLogDetail,
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
                  onClick={backLogDetail}
                >
                  <Back />
                </button>
                <button
                  className="panel-button forward-button"
                  onClick={forwardLogDetail}
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
          <XLogDetail />
        </PaneBody>
      </Pane>
    )
  }
}

import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as viewActions from "../actions/view"
import * as starActions from "../actions/starredLogs"
import * as detailActions from "../actions/logDetails"
import * as packetActions from "../actions/packets"
import * as view from "../reducers/view"
import * as logDetails from "../reducers/logDetails"
import * as spaces from "../reducers/spaces"

const stateToProps = state => ({
  isOpen: view.getRightSidebarIsOpen(state) && logDetails.buildLogDetail(state),
  width: view.getRightSidebarWidth(state),
  prevExists: logDetails.getPrevExists(state),
  nextExists: logDetails.getNextExists(state),
  isStarred: logDetails.getLogDetailIsStarred(state),
  currentLog: logDetails.buildLogDetail(state),
  space: spaces.getCurrentSpace(state)
})

export const XRightPane = connect(
  stateToProps,
  dispatch =>
    bindActionCreators(
      {...viewActions, ...starActions, ...detailActions, ...packetActions},
      dispatch
    )
)(RightPane)
