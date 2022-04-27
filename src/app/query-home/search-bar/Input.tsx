import {useSelector} from "react-redux"
import React, {useRef} from "react"
import styled from "styled-components"

import {cssVar} from "src/js/lib/cssVar"
import SearchBar from "src/js/state/SearchBar"
import CmdHistory from "src/app/core/models/cmd-history"
import submitSearch from "../flows/submit-search"
import {useDispatch} from "src/app/core/state"

const StyledInput = styled.input`
  display: block;
  outline: none;
  border: none;
  padding: 0 8px 0 12px;
  font-family: ${cssVar("--mono-font")};
  height: 28px;

  width: 100%;
  background: transparent;

  &:focus {
    outline: none;
  }
`

export default function Input() {
  const dispatch = useDispatch()
  const history = useRef(new CmdHistory([], 0, 1000))
  const inputValue = useSelector(SearchBar.getSearchBarInputValue)

  function changeTo(value: string) {
    dispatch(SearchBar.changeSearchBarInput(value))
  }

  function submit() {
    dispatch(submitSearch())
  }

  function onChange(e) {
    changeTo(e.currentTarget.value)
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      submit()
    }
    if (e.key === "ArrowUp" && !history.current.empty()) {
      changeTo(history.current.back())
    }
    if (e.key === "ArrowDown" && !history.current.empty()) {
      changeTo(history.current.forward())
    }
  }

  return (
    <StyledInput
      id="main-search-input"
      className="mousetrap"
      type="text"
      value={inputValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      spellCheck={false}
      autoFocus={true}
      autoComplete="off"
    />
  )
}
