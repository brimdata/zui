import React from "react"
import styled from "styled-components"

import Pins from "./Pins"
import Error from "./Error"
import Input from "./Input"
import InputBackdrop from "./InputBackdrop"
import Spinner from "./Spinner"
import FromPinPicker from "./from-pin-picker"

const Group = styled.div<{flex: number}>`
  display: flex;
  flex: ${(p) => p.flex || "initial"};
  flex-direction: column;
`

export default function SearchArea() {
  return (
    <>
      <FromPinPicker />
      <Group flex={1}>
        <Input />
        <Error />
        <Pins />
      </Group>
    </>
  )
}
