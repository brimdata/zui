import React from "react"
import styled from "styled-components"

const AddTabAnchor = styled.a`
  position: absolute;
  display: flex;
  align-items: center;
  left: 0;
  width: 30px;
  height: 100%;
  line-height: 27px;
  text-align: center;
  align-items: center;
  // TODO: Design
  color: black;
  border-radius: 50%;
  margin-left: 8px;
  margin-right: 8px;
  margin-bottom: 2px;
  font-size: 24px;
  cursor: default;
  user-select: none;
  transition: none;

  &:hover {
    transition: all 300ms;
    // TODO: Design
    color: white;
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    transition: none;
    background: rgba(255, 255, 255, 0.3);
  }
`

type Props = {
  onClick: (e: React.MouseEvent) => void
  left: number
}

export default function AddTab({onClick, left}: Props) {
  return (
    <AddTabAnchor
      onClick={onClick}
      style={{transform: `translateX(${left}px)`}}
    >
      +
    </AddTabAnchor>
  )
}
