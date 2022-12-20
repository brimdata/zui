import React from "react"
import styled from "styled-components"
import {ResultsActions} from "./results-actions"
import {ResultsViewSwitch} from "./results-view-switch"

const BG = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--chrome-color);
  height: 37px;
  padding: 0 8px;
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
