/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useRef} from "react"

import {XSearchButtonMenu} from "./SearchButtonMenu"
import {changeSearchBarInput} from "../state/actions"
import {getSearchBarInputValue} from "../state/selectors/searchBar"
import {reactElementProps} from "../test/integration"
import {submitSearchBar} from "../state/thunks/searchBar"
import DropMenu from "./DropMenu"
import InputHistory from "../models/InputHistory"
import ThreeDotButton from "./ThreeDotButton"

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
      <input
        id="main-search-input"
        type="text"
        value={inputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoFocus={true}
        autoComplete="off"
        {...reactElementProps("search_input")}
      />
      <DropMenu menu={XSearchButtonMenu} position="right">
        <ThreeDotButton {...reactElementProps("optionsButton")} />
      </DropMenu>
    </div>
  )
}
