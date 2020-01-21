/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch, State} from "../state/types"
import {fmtProgram} from "../lib/Program"
import FilterNode from "./FilterNode"
import Pin from "./icons/pin-md.svg"
import SearchBar from "../state/SearchBar"

type StateProps = {|
  editing: ?number,
  previousValue: string,
  pins: string[]
|}

type DispatchProps = {|
  dispatch: Dispatch
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

export default class Pins extends React.Component<Props> {
  renderFilter = (filter: string, index: number) => {
    return (
      <FilterNode
        key={index}
        filter={filter}
        focused={this.props.editing === index}
        pending={index === -1}
        onClick={() => {
          this.props.dispatch(SearchBar.editSearchBarPin(index))
        }}
        onRemoveClick={(e) => {
          e.stopPropagation()
          this.props.dispatch(SearchBar.removeSearchBarPin(index))
        }}
      />
    )
  }

  renderPinButton() {
    return (
      <div className="pin-button-wrapper">
        <span
          onClick={() => this.props.dispatch(SearchBar.editSearchBarPin(null))}
        >
          {fmtProgram(this.props.previousValue)}
        </span>
        <button
          className="pin-button"
          title="⌘K"
          onClick={() => this.props.dispatch(SearchBar.pinSearchBar())}
        >
          <Pin />
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="pins">
        {this.props.pins.map(this.renderFilter)}
        {this.renderPinButton()}
      </div>
    )
  }
}

const stateToProps = (state: State) => ({
  pins: SearchBar.getSearchBarPins(state),
  previousValue: SearchBar.getSearchBarPreviousInputValue(state),
  editing: SearchBar.getSearchBarEditingIndex(state)
})

export const XPins = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  (dispatch: Dispatch) => ({dispatch})
)(Pins)
