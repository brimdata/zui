import React from "react"
import styled from "styled-components"

const BG = styled.div`
  margin-top: 16px;
  padding: 24px;
  width: 100%;
  height: 100%;
  h2 {
    margin-bottom: 0.5em;
  }
`

export function DefaultError(props: {error: unknown}) {
  return (
    <BG>
      <h2>Error</h2>
      <p>{props.error.toString()}</p>
    </BG>
  )
}
