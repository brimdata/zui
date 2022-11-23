import React from "react"
import styled from "styled-components"
import {Subtitle} from "src/components/subtitle"

const DropBG = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  border-radius: 8px;
  background: rgb(255 255 255 / 0.9);
  border: 2px dashed var(--primary-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  text-align: center;
`

const DropMessage = styled.p`
  animation: updown 1200ms ease-in-out infinite alternate;
`

export const DropOverlay = (props: {
  children: React.ReactNode
  show: boolean
}) => {
  if (props.show) {
    return (
      <DropBG>
        <DropMessage>
          <Subtitle>{props.children}</Subtitle>
        </DropMessage>
      </DropBG>
    )
  } else {
    return null
  }
}
