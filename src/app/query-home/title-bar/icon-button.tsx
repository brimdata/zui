import React from "react"
import Icon, {IconName} from "src/app/core/icon-temp"
import styled from "styled-components"

const Button = styled.button`
  background: white;
  border: none;
  height: 22px;
  width: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: var(--button-background);
  }
  &:active {
    background: var(--button-background-active);
  }
`

type Props = {
  onClick: React.MouseEventHandler
  icon: IconName
}

export function IconButton(props: Props) {
  return (
    <Button onClick={props.onClick}>
      <Icon name={props.icon} size={18} />
    </Button>
  )
}
