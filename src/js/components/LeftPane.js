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
import {XLeftPaneCollapser} from "./LeftPaneCollapser"

type Props = {|
  isOpen: boolean,
  width: number,
  dispatch: Dispatch
|}

type S = {
  showCollapse: boolean
}

export default class LeftPane extends React.Component<Props, S> {
  state = {showCollapse: true}

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
        className="history-pane"
        onMouseEnter={() => this.setState({showCollapse: true})}
        onMouseLeave={() => this.setState({showCollapse: false})}
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
        <XLeftPaneCollapser show={this.state.showCollapse} />
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
