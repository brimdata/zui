import React from "react"
import {IconButton} from "src/components/icon-button"
import styled from "styled-components"

const BG = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  left: 0;
  height: 100%;
`

type Props = {
  onClick: () => void
  left: number
}

export default function AddTab({onClick, left}: Props) {
  return (
    <BG style={{transform: `translateX(${left}px)`}}>
      <IconButton
        label="New Tab"
        iconName="plus"
        iconSize={18}
        click={onClick}
      />
    </BG>
  )
}
