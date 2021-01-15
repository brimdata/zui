import React from "react"
import classNames from "classnames"
import styled, {css} from "styled-components"
import icons from "./icons"

type Props = {
  name: keyof typeof icons
  className?: string
  size?: number
  fill?: string
  stroke?: string
}

const Wrap = styled.i<{
  size?: number
  fill?: string
  stroke?: string
}>`
  display: flex;
  svg {
    height: ${(p) => p.size || 22}px;
    width: ${(p) => p.size || 22}px;
    fill: ${(p) => p.fill || css`var(--slate)`};
    stroke: ${(p) => p.stroke || "inherit"};
  }
`

export default function Icon(props: Props) {
  const SVG = icons[props.name]
  return (
    <Wrap
      className={classNames(props.className, `${props.name}-icon`)}
      size={props.size}
    >
      <SVG />
    </Wrap>
  )
}
