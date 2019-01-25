/* @flow */

import React from "react"
import InputHistory from "../models/InputHistory"
import {type Dispatch} from "../reducers/types"
import * as actions from "../actions/searchBar"
import {connect} from "react-redux"
import {getSearchBarInputValue, getSearchBarError} from "../selectors/searchBar"
import {type State} from "../reducers/types"

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
    this.props.dispatch(actions.changeSearchBarInput(value))
  }

  submit() {
    this.props.dispatch(actions.submitSearchBar())
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
