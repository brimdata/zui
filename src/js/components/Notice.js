/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import X from "../icons/x-md.svg"
import {CSSTransition} from "react-transition-group"
import * as Doc from "../lib/Doc"
import type {State} from "../reducers/types"
import type {Dispatch} from "../reducers/types"
import {connect} from "react-redux"
import * as notices from "../reducers/notices"
import {dismissNotice} from "../actions/notices"

type OwnProps = {||}
type StateProps = {|message: ?string|}
type DispatchProps = {|dispatch: Dispatch|}
type AllProps = {|...OwnProps, ...StateProps, ...DispatchProps|}

export default class Notice extends React.Component<AllProps> {
  timeout: ?TimeoutID
  dismiss: Function

  constructor(props: AllProps) {
    super(props)
    this.timeout = null

    this.dismiss = () => {
      if (this.timeout) clearTimeout(this.timeout)
      this.props.dispatch(dismissNotice())
    }
  }

  render() {
    if (this.props.message) {
      this.timeout = setTimeout(() => this.dismiss(), 6000)
    }

    return ReactDOM.createPortal(
      <CSSTransition
        timeout={300}
        in={!!this.props.message}
        unmountOnExit
        mountOnEnter
        classNames="notice"
      >
        <div className="notice">
          <p>{this.props.message}</p>
          <button className="close-button" onClick={this.dismiss}>
            <X />
          </button>
        </div>
      </CSSTransition>,
      Doc.id("notification-root")
    )
  }
}

const stateToProps = (state: State) => ({
  message: notices.getError(state)
})

export const XNotice = connect<AllProps, OwnProps, _, _, _, _>(
  stateToProps,
  (dispatch: Dispatch) => ({dispatch})
)(Notice)
