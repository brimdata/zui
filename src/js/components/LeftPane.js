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

type Props = {|
  setLeftSidebarWidth: Function,
  clearFilterTree: Function,
  isOpen: boolean,
  width: number
|}

export default class LeftPane extends React.Component<Props> {
  onDrag = (e: MouseEvent) => {
    const width = e.clientX
    const max = window.innerWidth
    this.props.setLeftSidebarWidth(Math.min(width, max))
  }

  render() {
    const {isOpen, width, clearFilterTree} = this.props

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
              onClick={clearFilterTree}
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
