import React from "react"
import {H1} from "src/components/h1"
import styled from "styled-components"

const BG = styled.div`
  margin: 0 auto;
  margin-top: 10vh;
  text-align: center;
  padding: 1rem;
`

export function NotFound() {
  return (
    <BG>
      <H1>Pool Not Found</H1>
      <p>This pool has been deleted or never existed.</p>
    </BG>
  )
}
