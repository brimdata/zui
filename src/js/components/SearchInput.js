/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch, State} from "../state/types"
import {changeSearchBarInput} from "../state/actions"
import {
  getSearchBarInputValue,
  getSearchBarError
} from "../state/selectors/searchBar"
import {submitSearchBar} from "../state/thunks/searchBar"
import InputHistory from "../models/InputHistory"

type StateProps = {|
  inputValue: string,
  error: ?string,
  dispatch: Dispatch
|}

type DispatchProps = {|
  dispatch: Dispatch
|}

type Props = {|...StateProps, ...DispatchProps|}

export default class SearchInput extends React.Component<Props> {
  history = new InputHistory<string>()

  onChange = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    this.changeTo(e.currentTarget.value)
  }

  onKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.submit()
      this.history.push(e.currentTarget.value)
    }
    if (e.key === "ArrowUp") {
      this.history.goBack()
      this.changeTo(this.history.getCurrentEntry())
    }
    if (e.key === "ArrowDown") {
      this.history.goForward()
      this.changeTo(this.history.getCurrentEntry())
    }
  }

  changeTo(value: string) {
    this.props.dispatch(changeSearchBarInput(value))
  }

  submit() {
    this.props.dispatch(submitSearchBar())
  }

  render() {
    const {inputValue} = this.props
    return (
      <div className="search-input">
        <div className="text-input-wrapper">
          <input
            id="main-search-input"
            type="text"
            value={inputValue}
            placeholder="Search"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            spellCheck={false}
            autoFocus={true}
            autoComplete="off"
          />
        </div>
      </div>
    )
  }
}

const stateToProps = (state: State) => ({
  inputValue: getSearchBarInputValue(state),
  error: getSearchBarError(state)
})

export const XSearchInput = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  (dispatch: Dispatch) => ({dispatch})
)(SearchInput)
