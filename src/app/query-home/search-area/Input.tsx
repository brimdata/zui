import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components"

import {cssVar} from "src/js/lib/cssVar"
import SearchBar from "src/js/state/SearchBar"
import CmdHistory from "src/app/core/models/cmd-history"
import submitSearch from "../flows/submit-search"
import BrimEditor from "../../core/components/brim-editor"
import Spinner from "./Spinner"
import InputBackdrop from "./InputBackdrop"

export const hasNewLine = (str) => /\n/.test(str)

export default function Input() {
  const inputValue = useSelector(SearchBar.getSearchBarInputValue)

  return (
    <InputBackdrop isVisible={!hasNewLine(inputValue)}>
      <BrimEditor />
      <Spinner />
      {/*<StyledInput*/}
      {/*  id="main-search-input"*/}
      {/*/>*/}
    </InputBackdrop>
  )
}
