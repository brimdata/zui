/* @flow */

import React from "react"
import mapJoin from "../lib/mapJoin"
import Pin from "../icons/pin-md.svg"
import FilterNode from "./FilterNode"
import {connect} from "react-redux"
import * as actions from "../actions/searchBar"
import {
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  getSearchBarEditingIndex
} from "../selectors/searchBar"
import type {State} from "../reducers/types"
import type {Dispatch} from "../reducers/types"

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
          this.props.dispatch(actions.editSearchBarPin(index))
        }}
        onRemoveClick={e => {
          e.stopPropagation()
          this.props.dispatch(actions.removeSearchBarPin(index))
        }}
      />
    )
  }

  renderJoinOperator = (index: number) => {
    return (
      <p className="join-operator" key={index + "-operator"}>
        AND
      </p>
    )
  }

  renderPinButton() {
    return (
      <button
        className="button pin-filter"
        title="⌘K"
        onClick={() => this.props.dispatch(actions.pinSearchBar())}
      >
        <Pin />
      </button>
    )
  }

  render() {
    const {previousValue, pins} = this.props
    const hasStagedFilter = !/^\s*$/.test(previousValue)
    const hasCommittedFilter = pins.length > 0
    if (!hasStagedFilter && !hasCommittedFilter) return null

    return (
      <div className="pins">
        {mapJoin(pins, this.renderFilter, this.renderJoinOperator)}
        {hasStagedFilter &&
          hasCommittedFilter &&
          this.renderJoinOperator(pins.length)}
        {hasStagedFilter && this.renderFilter(previousValue, -1)}
        {hasStagedFilter && this.renderPinButton()}
      </div>
    )
  }
}

const stateToProps = (state: State) => ({
  pins: getSearchBarPins(state),
  previousValue: getSearchBarPreviousInputValue(state),
  editing: getSearchBarEditingIndex(state)
})

export const XPins = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  (dispatch: Dispatch) => ({dispatch})
)(Pins)
