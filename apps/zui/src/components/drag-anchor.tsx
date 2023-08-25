import classNames from "classnames"
import React from "react"
import {call} from "src/util/call"
import styled from "styled-components"

const Area = styled.div`
  position: absolute;
  background: transparent;
  pointer-events: all !important;
  z-index: 99;

  &.debug {
    outline: 1px dashed blue;
  }

  &.align-left {
    top: 0;
    bottom: 0;
    width: 9px;
    left: -5px;
    cursor: col-resize;
  }

  &.align-right {
    top: 0;
    bottom: 0;
    width: 9px;
    right: -5px;
    cursor: col-resize;
  }

  &.align-top {
    left: 0;
    right: 0;
    height: 9px;
    top: -5px;
    cursor: row-resize;
  }

  &.align-bottom {
    left: 0;
    right: 0;
    height: 9px;
    bottom: -5px;
    cursor: row-resize;
  }
`
type Props = {
  debug?: boolean
  position: "left" | "right" | "top" | "bottom"
  onDrag?: (e: MouseEvent, args: {dy: number; dx: number}) => void
  onStart?: (e: React.MouseEvent) => void
}
export default class DragAnchor extends React.Component<Props> {
  private startX: number
  private startY: number

  componentWillUnmount() {
    this.up()
  }

  down = (e: React.MouseEvent) => {
    this.startX = e.clientX
    this.startY = e.clientY
    const body = document.body
    body.style.cursor = this.getCursor()
    body.style.userSelect = "none"
    document.addEventListener("mousemove", this.move)
    document.addEventListener("mouseup", this.up)
    call(this.props.onStart, e)
  }

  move = (e: MouseEvent) => {
    const dx = e.clientX - this.startX
    const dy = e.clientY - this.startY
    call(this.props.onDrag, e, {dx, dy})
  }

  up = () => {
    const body = document.body
    if (body) {
      body.style.cursor = ""
      body.style.userSelect = ""
      document.removeEventListener("mousemove", this.move)
      document.removeEventListener("mouseup", this.up)
    }
  }

  getCursor() {
    if (["left", "right"].includes(this.props.position)) {
      return "col-resize"
    } else {
      return "row-resize"
    }
  }

  render() {
    return (
      <Area
        className={classNames(`align-${this.props.position}`, {
          debug: this.props.debug,
        })}
        onMouseDown={this.down}
      />
    )
  }
}
