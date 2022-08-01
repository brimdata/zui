import React, {RefCallback} from "react"
import styled from "styled-components"
import ActionButton, {ActionButtonProps} from "./action-button"

export const GUTTER = 8

const BG = styled.div<{size: number}>`
  display: flex;
  flex: 0 1 auto;
  overflow: hidden;
  justify-content: flex-end;
  width: ${(p) => p.size}px;

  & > * {
    margin-right: ${GUTTER}px;
    &:last-child {
      margin-right: 0;
    }
  }
`

type Props = {
  actions: ActionButtonProps[]
  innerRef?: RefCallback<HTMLElement>
  width?: number
}

export default function ActionButtons({actions, width, innerRef}: Props) {
  return (
    <BG ref={innerRef} size={width}>
      {actions.map((props, i) => (
        <ActionButton key={i} {...props} />
      ))}
    </BG>
  )
}
