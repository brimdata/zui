import React from "react"
import ReactDOM from "react-dom"
import {connect} from "react-redux"
import {CSSTransition} from "react-transition-group"
import Appearance from "src/js/state/Appearance"
import lib from "../../lib"
import dispatchToProps from "../../lib/dispatchToProps"
import MouseoverWatch from "../../lib/MouseoverWatch"
import {Dispatch} from "../../state/types"
import CircleChevron from "../CircleChevron"

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
    this.props.dispatch(Appearance.toggleSidebar())
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
      lib.doc.id("tooltip-root")
    )
  }
}

export const XLeftPaneExpander = connect(
  null,
  dispatchToProps
)(LeftPaneExpander)
