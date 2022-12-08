import React from "react"
import styled from "styled-components"
import {ResultsActions} from "./results-actions"
import {ResultsViewSwitch} from "./results-view-switch"

const BG = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  background: var(--chrome-color);
  border-bottom: 1px solid var(--border-color);
`

export function ResultsToolbar() {
  return (
    <BG>
      <ResultsViewSwitch />
      <ResultsActions />
    </BG>
  )
}
