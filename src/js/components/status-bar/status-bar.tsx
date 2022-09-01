import React from "react"
import styled from "styled-components"
import {IngestProgress} from "./ingest-progress"
import {QueryProgress} from "./query-progress"
import {TypeCount} from "./type-count"

const BG = styled.footer`
  grid-area: status;
  user-select: none;
  background: var(--tab-background);
  border-top: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  padding: 0 22px;
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 13px;
  line-height: 13px;
  opacity: 0.8;
`

export default function StatusBar() {
  return (
    <BG>
      <QueryProgress />
      <IngestProgress />
      <TypeCount />
    </BG>
  )
}
