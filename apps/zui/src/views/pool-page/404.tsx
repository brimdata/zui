import React from "react"
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
      <h1>Pool Not Found</h1>
      <p>This pool has been deleted.</p>
    </BG>
  )
}
