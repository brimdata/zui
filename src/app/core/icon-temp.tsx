import React from "react"
import classNames from "classnames"
import styled, {css} from "styled-components"
import icons from "./icons"

export type IconName = keyof typeof icons

type Props = {
  name: IconName
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
    fill: ${(p) => p.fill || css`var(--foreground-color)`};
    stroke: ${(p) => p.stroke || "inherit"};
  }
`

export default function Icon(props: Props) {
  const SVG = icons[props.name]
  if (!SVG) throw new Error(`No Icon: "${props.name}"`)
  return (
    <Wrap
      className={classNames(props.className, `${props.name}-icon`)}
      size={props.size}
      fill={props.fill}
      stroke={props.stroke}
    >
      <SVG />
    </Wrap>
  )
}
