import React, {RefCallback} from "react"
import styled from "styled-components"
import ActionButton, {ActionButtonProps} from "./action-button"

type Justify = "center" | "flex-end"

export const GUTTER = 8

const BG = styled.div<{justify: Justify}>`
  display: flex;
  justify-content: ${(p) => p.justify};
  flex: 1;
  & > * {
    margin-right: ${GUTTER}px;
    &:last-child {
      margin-right: 0;
    }
  }
`

type Props = {
  actions: ActionButtonProps[]
  justify: Justify
  innerRef: RefCallback<HTMLDivElement>
}

export default function ActionButtons({actions, justify, innerRef}: Props) {
  return (
    <BG ref={innerRef} justify={justify}>
      {actions.map((props, i) => (
        <ActionButton key={i} {...props} />
      ))}
    </BG>
  )
}
