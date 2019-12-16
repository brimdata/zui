/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {DispatchProps} from "../state/types"
import {goBack, goForward} from "../state/thunks/searchBar"
import Back from "./icons/back-arrow.svg"
import Forward from "./icons/forward-arrow.svg"
import dispatchToProps from "../lib/dispatchToProps"
import * as searchHistory from "../state/reducers/searchHistory"

type StateProps = {
  canGoBack: boolean,
  canGoForward: boolean
}

type Props = {...StateProps, ...DispatchProps}

export default class HistoryStepper extends React.Component<Props> {
  back = () => {
    this.props.dispatch(goBack())
  }

  forward = () => {
    this.props.dispatch(goForward())
  }

  render() {
    return (
      <div className="history-stepper">
        <button
          disabled={!this.props.canGoBack}
          className="panel-button"
          onClick={this.back}
        >
          <Back />
        </button>
        <button
          disabled={!this.props.canGoForward}
          className="panel-button"
          onClick={this.forward}
        >
          <Forward />
        </button>
      </div>
    )
  }
}

const stateToProps = (state) => ({
  canGoBack: searchHistory.canGoBack(state),
  canGoForward: searchHistory.canGoForward(state)
})

export const XHistoryStepper = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(HistoryStepper)
