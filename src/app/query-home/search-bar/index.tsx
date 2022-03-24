import React from "react"
import styled from "styled-components"

import {Pins} from "./pins/pins"
import Error from "./Error"
import Input from "./Input"
import InputBackdrop from "./InputBackdrop"
import Spinner from "./Spinner"

const Group = styled.div<{flex: number}>`
  display: flex;
  flex: ${(p) => p.flex || "initial"};
  flex-direction: column;
`

export default function SearchBar() {
  return (
    <>
      <Pins />
      <Group flex={1}>
        <InputBackdrop>
          <Input />
          <Spinner />
        </InputBackdrop>
        <Error />
      </Group>
    </>
  )
}
