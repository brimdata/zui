import React from "react"

import styled from "styled-components"
import LakePicker from "./lake-picker"
import PlusButton from "./plus-button"

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  user-select: none;
`

export default function Header() {
  return (
    <Container>
      <LakePicker />
      <PlusButton />
    </Container>
  )
}
