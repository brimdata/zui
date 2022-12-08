import React, {RefCallback} from "react"
import styled from "styled-components"
import ActionButton, {ActionButtonProps} from "./action-button"

export const GUTTER = 10

const BG = styled.div`
  display: flex;
  flex: 0 1 auto;
  overflow: hidden;
  justify-content: flex-end;

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
  labels?: boolean
}

export default function ActionButtons({actions, innerRef, labels}: Props) {
  return (
    <BG ref={innerRef}>
      {actions.map((props, i) => (
        <ActionButton key={i} {...props} showLabel={labels} />
      ))}
    </BG>
  )
}
