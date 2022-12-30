import React, {RefCallback} from "react"
import {MenuItem} from "src/core/menu"
import styled from "styled-components"
import ActionButton, {ActionButtonProps} from "./action-button"

export const GUTTER = 10

const BG = styled.div`
  display: flex;
  overflow: hidden;
  justify-content: flex-end;
  align-items: center;
  height: 100%;

  & > * {
    margin-right: ${GUTTER}px;
    &:last-child {
      margin-right: 0;
    }
  }
`

type Props = {
  actions: MenuItem[]
  innerRef?: RefCallback<HTMLElement>
  width?: number
}

export default function ActionButtons({actions, innerRef}: Props) {
  return (
    <BG ref={innerRef}>
      {actions.map((props, i) => (
        <ActionButton key={i} {...props} />
      ))}
    </BG>
  )
}
