import React from "react"

import styled from "styled-components"
import LakePicker from "./lake-picker"
import PlusButton from "./plus-button"

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export default function Header() {
  return (
    <Container>
      <LakePicker />
      <PlusButton />
    </Container>
  )
}
