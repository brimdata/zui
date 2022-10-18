import React from "react"
import styled from "styled-components"
import {ResultsActions} from "./results-actions"
import {ResultsViewSwitch} from "./results-view-switch"

const BG = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 16px;
`

export function ResultsToolbar() {
  return (
    <BG>
      <ResultsViewSwitch />
      <ResultsActions />
    </BG>
  )
}
