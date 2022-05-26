import React from "react"
import SubmitButton from "./submit-button"
import styled from "styled-components"
import QueryEditor from "./editor/query-editor"

const InputBackdrop = styled.div`
  border-bottom: 1px solid var(--border-color);
  position: relative;
  height: 100px;
`

const Submit = styled(SubmitButton)`
  position: absolute;
  right: 20px;
  bottom: 6px;
`

type Props = {
  value: string
  disabled?: boolean
}

export default function Input({value, disabled}: Props) {
  return (
    <InputBackdrop>
      <QueryEditor value={value} disabled={disabled} />
      <Submit />
    </InputBackdrop>
  )
}
