import React from "react"
import Icon from "src/app/core/icon-temp"
import styled from "styled-components"

const BG = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  left: 0;
  height: 100%;
`

const Button = styled.button`
  display: flex;
  width: 28px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  border-width: 0;
  font-weight: 300;
  font-size: 24px;
  line-height: 32px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    transition: background-color 300ms;
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.12);
    transition: background-color 0ms;
  }
`

type Props = {
  onClick: (e: React.MouseEvent) => void
  left: number
}

export default function AddTab({onClick, left}: Props) {
  return (
    <BG style={{transform: `translateX(${left}px)`}}>
      <Button onClick={onClick}>
        <Icon size={18} name="plus" fill="var(--foreground-color)" />
      </Button>
    </BG>
  )
}
