import React from "react"
import styled from "styled-components"

import ColumnsButton from "./ColumnsButton"
import ExportButton from "./ExportButton"
import PacketsButton from "./PacketsButton"
import SearchPageTitle from "../SearchPageTitle"
import SpanControls from "../Span/SpanControls"
import SubspaceButton from "./SubspaceButton"
import ViewButton from "./ViewButton"

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  flex-wrap: wrap;
`

const Group = styled.div<{flex?: number}>`
  display: flex;
  justify-content: space-between;
  flex: ${(props) => props.flex};
  & > * {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`

export function Toolbar() {
  return (
    <Wrap>
      <Group flex={1} style={{minWidth: 120}}>
        <SearchPageTitle />
      </Group>
      <Group flex={2}>
        <Group>
          <SubspaceButton />
          <PacketsButton label id="toolbar-packets" />
          <ExportButton />
          <ColumnsButton />
          <ViewButton />
        </Group>
        <SpanControls />
      </Group>
    </Wrap>
  )
}
