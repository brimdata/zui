/* @flow */

import React from "react"
import {connect} from "react-redux"
import CircleChevron from "./CircleChevron"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"
import dispatchToProps from "../lib/dispatchToProps"
import type {Dispatch} from "../reducers/types"
import {showLeftSidebar} from "../actions/view"
import MouseoverWatch from "../lib/MouseoverWatch"
import {CSSTransition} from "react-transition-group"

type Props = {dispatch: Dispatch}
type State = {show: boolean}

export default class LeftPaneExpander extends React.Component<Props, State> {
  watcher = new MouseoverWatch()
  state = {show: false}

  componentDidMount() {
    this.watcher
      .addListener()
      .condition(([x]) => x < 36)
      .onEnter(() => this.setState({show: true}))
      .onExit(() => this.setState({show: false}))
      .exitDelay(500)
  }

  componentWillUnmount() {
    this.watcher.removeListener()
  }

  onClick = () => {
    this.props.dispatch(showLeftSidebar())
  }

  render() {
    return ReactDOM.createPortal(
      <CSSTransition
        classNames="slide-in-from-left"
        timeout={{enter: 150, exit: 150}}
        in={this.state.show}
        mountOnEnter
        unmountOnExit
      >
        <div className="left-pane-expand-button" onClick={this.onClick}>
          <CircleChevron right expand />
        </div>
      </CSSTransition>,
      Doc.id("tooltip-root")
    )
  }
}

export const XLeftPaneExpander = connect<Props, {||}, _, _, _, _>(
  null,
  dispatchToProps
)(LeftPaneExpander)
