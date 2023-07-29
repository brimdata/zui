import React from "react"
import styled from "styled-components"
import QueryEditor from "./editor/query-editor"

const InputBackdrop = styled.div`
  position: relative;
  height: 100%;
`

type Props = {
  value: string
  disabled?: boolean
}

export default function Input({value, disabled}: Props) {
  return (
    <InputBackdrop>
      <QueryEditor value={value} disabled={disabled} />
    </InputBackdrop>
  )
}
