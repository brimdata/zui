import {useSelector} from "react-redux"
import React from "react"
import SearchBar from "src/js/state/SearchBar"
import BrimEditor from "../../core/components/brim-editor"
import Spinner from "./Spinner"
import InputBackdrop from "./InputBackdrop"
import SubmitButton from "./SubmitButton"
import styled from "styled-components"

export const hasNewLine = (str) => /\n/.test(str)

const InputButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export default function Input() {
  const inputValue = useSelector(SearchBar.getSearchBarInputValue)
  const isMultiLine = hasNewLine(inputValue)
  return (
    <InputBackdrop isVisible={!isMultiLine}>
      <BrimEditor />
      <InputButtonRow>
        <Spinner />
        <SubmitButton isMultiLine={isMultiLine} />
      </InputButtonRow>
    </InputBackdrop>
  )
}
