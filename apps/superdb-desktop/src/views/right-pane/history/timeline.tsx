import React from "react"
import styled from "styled-components"

const Wrap = styled.div`
  width: 6px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Circle = styled.div<{color: string}>`
  width: 6px;
  height: 6px;
  border: 1px solid ${(p) => p.color};
  position: relative;
  margin: 3px 0;
  border-radius: 50%;
  &:after {
    background: ${(p) => p.color};
    content: "";
    width: 6px;
    height: 6px;
    position: absolute;
    top: -1px;
    left: -1px;
    opacity: 0.3;
    border-radius: 50%;
  }
`

const Line = styled.div`
  width: 2px;
  flex: 1;
  background: var(--border-color);

  &:first-child {
    border-radius: 0 0 1px 1px;
  }
  &:last-child {
    border-radius: 1px 1px 0 0;
  }
`

export function Timeline(props: {color: string}) {
  return (
    <Wrap>
      <Line />
      <Circle color={props.color || "var(--primary-color)"} />
      <Line />
    </Wrap>
  )
}
