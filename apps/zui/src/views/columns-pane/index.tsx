import React from "react"
import {Scrollable} from "src/components/scrollable"
import styled from "styled-components"
import {ColumnsToolbar} from "./columns-toolbar"
import {ColumnsTree} from "./columns-tree"

const BG = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export function ColumnsPane() {
  return (
    <BG>
      <ColumnsToolbar />
      <Scrollable>
        <ColumnsTree />
      </Scrollable>
    </BG>
  )
}
