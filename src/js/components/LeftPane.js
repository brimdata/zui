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
import XHistoryAside from "../connectors/XHistoryAside"
import {connect} from "react-redux"
import * as view from "../reducers/view"
import dispatchToProps from "../lib/dispatchToProps"
import type {Dispatch, State} from "../reducers/types"
import {clearFilterTree} from "../actions/filterTree"
import {setLeftSidebarWidth} from "../actions/view"
import {XLeftPaneExpander} from "./LeftPaneExpander"

type Props = {|
  isOpen: boolean,
  width: number,
  dispatch: Dispatch
|}

export default class LeftPane extends React.Component<Props> {
  onDrag = (e: MouseEvent) => {
    const width = e.clientX
    const max = window.innerWidth
    this.props.dispatch(setLeftSidebarWidth(Math.min(width, max)))
  }

  render() {
    const {isOpen, width} = this.props

    if (!isOpen) {
      return <XLeftPaneExpander />
    }

    return (
      <Pane
        isOpen={isOpen}
        position="left"
        width={width}
        onDrag={this.onDrag}
        className="history-pane "
      >
        <PaneHeader>
          <Left />
          <Center>
            <PaneTitle>Search History</PaneTitle>
          </Center>
          <Right>
            <button
              onClick={() => this.props.dispatch(clearFilterTree())}
              className="panel-button clear-button"
            >
              CLEAR
            </button>
          </Right>
        </PaneHeader>
        <PaneBody>
          <XHistoryAside />
        </PaneBody>
      </Pane>
    )
  }
}

const stateToProps = (state: State) => ({
  isOpen: view.getLeftSidebarIsOpen(state),
  width: view.getLeftSidebarWidth(state)
})

export const XLeftPane = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(LeftPane)
