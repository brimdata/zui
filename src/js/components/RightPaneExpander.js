/* @flow */

import React from "react"
import {connect} from "react-redux"
import CircleChevron from "./CircleChevron"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"
import dispatchToProps from "../lib/dispatchToProps"
import type {Dispatch} from "../state/reducers/types"
import {showRightSidebar} from "../state/actions/view"
import MouseoverWatch from "../lib/MouseoverWatch"
import {CSSTransition} from "react-transition-group"

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
