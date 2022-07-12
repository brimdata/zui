import React from "react"
import styled from "styled-components"
import {IngestProgress} from "./ingest-progress"
import {QueryProgress} from "./query-progress"

const BG = styled.footer`
  grid-area: status;
  user-select: none;
  background: var(--tab-background);
  border-top: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  padding: 0 20px;
  display: flex;
  align-items: center;
`

export default function StatusBar() {
  return (
    <BG>
      <QueryProgress />
      <IngestProgress />
    </BG>
  )
}
