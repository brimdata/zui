import React from "react"
import BrimEditor from "../../core/components/brim-editor"
import Spinner from "./spinner"
import SubmitButton from "./submit-button"
import styled from "styled-components"

export const hasNewLine = (str) => /\n/.test(str)

const InputButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const InputBackdrop = styled.div<{isVisible: boolean}>`
  display: flex;
  ${(p) =>
    p.isVisible
      ? `
  flex-direction: row;
  outline: none;
  border: none;
  padding: 0 0 0 14px;
  border-radius: 15px;
  height: 28px;
  line-height: 24px;
  font-size: 13px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.77);
  width: 100%;
  position: relative;
  background: var(--coconut);
  align-items: center;
  `
      : `
  flex-direction: column;
  background: var(--editor-background);
  `};
`

export default function Input({isMultiLine}: {isMultiLine: boolean}) {
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
