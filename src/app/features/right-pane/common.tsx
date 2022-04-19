import React, {HTMLProps} from "react"
import styled from "styled-components"

// Left, PaneBody, Right
export const Right = styled.div`
  display: flex;
`

export const Left = styled.div`
  display: flex;
`

export const PaneBody = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

export const PaneHeader = styled.header`
  user-select: none;
  position: relative;
  svg {
    fill: var(--slate);
  }
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  margin-top: 8px;
`
