/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useRef} from "react"

import {changeSearchBarInput} from "../state/actions"
import {getSearchBarInputValue} from "../state/selectors/searchBar"
import {reactElementProps} from "../test/integration"
import {submitSearchBar} from "../state/thunks/searchBar"
import InputHistory from "../models/InputHistory"

export default function SearchInput() {
  let dispatch = useDispatch()
  let history = useRef(new InputHistory<string>())
  let inputValue = useSelector(getSearchBarInputValue)

  function changeTo(value: string) {
    dispatch(changeSearchBarInput(value))
  }

  function submit() {
    dispatch(submitSearchBar())
  }

  function onChange(e) {
    changeTo(e.currentTarget.value)
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      submit()
      history.current.push(e.currentTarget.value)
    }
    if (e.key === "ArrowUp") {
      history.current.goBack()
      changeTo(history.current.getCurrentEntry())
    }
    if (e.key === "ArrowDown") {
      history.current.goForward()
      changeTo(history.current.getCurrentEntry())
    }
  }

  return (
    <div className="search-input">
      <div className="text-input-wrapper">
        <input
          id="main-search-input"
          type="text"
          value={inputValue}
          placeholder="Search"
          onChange={onChange}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoFocus={true}
          autoComplete="off"
          {...reactElementProps("search_input")}
        />
      </div>
    </div>
  )
}
