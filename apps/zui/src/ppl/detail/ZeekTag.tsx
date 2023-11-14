import classNames from "classnames"
import React from "react"
import styled from "styled-components"
import {SecurityEventInterface} from "./models/security-event"

const BG = styled.div`
  height: 22px;
  border-radius: 3px;
  display: inline-flex;
  color: white;
  cursor: default;
  user-select: none;
  justify-content: center;
  min-width: fit-content;
`

const Type = styled.span`
  padding: 0 8px;
  font-family: var(--mono-font);
`

type Props = {event: SecurityEventInterface; className?: string}

export default function ZeekTag({event, className, ...rest}: Props) {
  return (
    <BG
      className={classNames(className, event.getType() + "-bg-color")}
      {...rest}
    >
      <Type>{event.getType()}</Type>
    </BG>
  )
}
