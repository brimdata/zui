import React from "react"
import Spinner from "./spinner"
import SubmitButton from "./submit-button"
import styled from "styled-components"
import QueryEditor from "./editor/query-editor"

const InputButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const InputBackdrop = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--editor-background);
  box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.1),
    inset 0 -1px 1px 0 rgba(0, 0, 0, 0.1);
`

type Props = {
  value: string
  multiline?: boolean
  disabled?: boolean
}

export default function Input({value, disabled}: Props) {
  return (
    <InputBackdrop>
      <QueryEditor value={value} disabled={disabled} />
      <InputButtonRow>
        <Spinner />
        <SubmitButton />
      </InputButtonRow>
    </InputBackdrop>
  )
}
