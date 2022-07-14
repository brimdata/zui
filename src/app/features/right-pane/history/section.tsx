import React from "react"
import styled from "styled-components"
import {HistoryEntry} from "./entry"

const BG = styled.div`
  padding: 6px 0;
`

export function HistorySection() {
  return (
    <BG>
      <HistoryEntry text="Activity Overview" timestamp="now" type="outdated" />
      <HistoryEntry text="Activity Overview" timestamp="1m" type="saved" />
      <HistoryEntry
        text="count() by _path | filter this | filter that | filter everything"
        timestamp="2m"
        type="anonymous"
      />
    </BG>
  )
}
