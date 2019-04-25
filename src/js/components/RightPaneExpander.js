/* @flow */

import {CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import type {Dispatch} from "../state/types"
import {showRightSidebar} from "../state/actions"
import CircleChevron from "./CircleChevron"
import * as Doc from "../lib/Doc"
import MouseoverWatch from "../lib/MouseoverWatch"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {dispatch: Dispatch}
type State = {show: boolean}

export default class RightPaneExpander extends React.Component<Props, State> {
  watcher = new MouseoverWatch()
  state = {show: false}

  componentDidMount() {
    this.watcher
      .addListener()
      .condition(([x]) => Doc.getWidth() - x < 36)
      .onEnter(() => this.setState({show: true}))
      .onExit(() => this.setState({show: false}))
      .exitDelay(500)
  }

  componentWillUnmount() {
    this.watcher.removeListener()
  }

  onClick = () => {
    this.props.dispatch(showRightSidebar())
  }

  render() {
    return ReactDOM.createPortal(
      <CSSTransition
        classNames="slide-in-from-right"
        timeout={{enter: 150, exit: 150}}
        in={this.state.show}
        mountOnEnter
        unmountOnExit
      >
        <div className="right-pane-expand-button" onClick={this.onClick}>
          <CircleChevron left expand light />
        </div>
      </CSSTransition>,
      Doc.id("tooltip-root")
    )
  }
}

export const XRightPaneExpander = connect<Props, {||}, _, _, _, _>(
  null,
  dispatchToProps
)(RightPaneExpander)
