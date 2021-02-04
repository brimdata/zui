import React from "react"
import styled from "styled-components"

import SearchPageTitle from "src/js/components/SearchPageTitle"
import SpanControls from "src/js/components/Span/SpanControls"
import MainViewSwitch from "./main-view-switch"
import Actions from "./actions"

const Wrap = styled.div`
  margin-bottom: 6px;
`

const Group = styled.div`
  display: flex;
  & > * {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;

  & > * {
  }
`

export function Toolbar() {
  return (
    <Wrap>
      <SearchPageTitle />
      <Row>
        <Group>
          <MainViewSwitch />
        </Group>
        <Actions />
        <SpanControls />
      </Row>
    </Wrap>
  )
}
