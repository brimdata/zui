import React from "react"
import Spinner from "./spinner"
import SubmitButton from "./submit-button"
import styled from "styled-components"
import QueryEditor from "./editor/query-editor"

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
  box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.1), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.1);
  `};
`

type Props = {
  value: string
  multiline?: boolean
  disabled?: boolean
}

export default function Input({value, multiline, disabled}: Props) {
  return (
    <InputBackdrop isVisible={!multiline}>
      <QueryEditor value={value} disabled={disabled} />
      <InputButtonRow>
        <Spinner />
        <SubmitButton isMultiLine={multiline} />
      </InputButtonRow>
    </InputBackdrop>
  )
}
