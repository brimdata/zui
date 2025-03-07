import classNames from "classnames"
import React, {CSSProperties} from "react"
import {call} from "src/util/call"
import styled from "styled-components"

const Area = styled.div`
  position: absolute;
  background: transparent;
  pointer-events: all !important;
  z-index: 99;
  --size: 11px;
  --padding: 1px;
  --offset: -4px;

  &.debug {
    background: red;
    outline: 1px dashed blue;
  }

  &.align-left {
    top: 0;
    bottom: 0;
    width: var(--size);
    left: var(--offset);
    cursor: col-resize;
    padding: 0 var(--padding);
  }

  &.align-right {
    top: 0;
    bottom: 0;
    width: var(--size);
    right: var(--offset);
    cursor: col-resize;
    padding: 0 var(--padding);
  }

  &.align-top {
    left: 0;
    right: 0;
    height: var(--size);
    top: var(--offset);
    cursor: row-resize;
    padding: var(--padding) 0;
  }

  &.align-bottom {
    left: 0;
    right: 0;
    height: var(--size);
    bottom: var(--offset);
    cursor: row-resize;
    padding: var(--padding) 0;
  }

  &.showOnHover {
    background-color: transparent;
    transition: all 0ms;
  }

  &.showOnHover:hover {
    transition: all 500ms 200ms;
    background-color: var(--primary-color);
  }

  &.showOnHover:active {
    transition: all 0s;
    background-color: var(--primary-color-dark);
  }
`

type Props = {
  debug?: boolean
  showOnHover?: boolean
  position: "left" | "right" | "top" | "bottom"
  className?: string
  style?: CSSProperties
  onDrag?: (e: MouseEvent, args: {dy: number; dx: number}) => void
  onStart?: (e: React.MouseEvent) => void
  onEnd?: () => void
}
export default class DragAnchor extends React.Component<Props> {
  private startX: number
  private startY: number
  private cleanup = () => {}

  componentWillUnmount() {
    this.up()
  }

  down = (e: React.MouseEvent) => {
    const body = document.body
    const el = e.currentTarget
    this.startX = e.clientX
    this.startY = e.clientY
    body.style.cursor = this.getCursor()
    body.style.userSelect = "none"
    body.classList.add("is-dragging")
    el.classList.add("is-dragging")
    document.addEventListener("mousemove", this.move)
    document.addEventListener("mouseup", this.up)

    this.cleanup = () => {
      document.removeEventListener("mousemove", this.move)
      document.removeEventListener("mouseup", this.up)
      if (body) {
        body.style.cursor = ""
        body.style.userSelect = ""
        body.classList.remove("is-dragging")
      }
      if (el) {
        el.classList.remove("is-dragging")
      }
    }

    call(this.props.onStart, e)
  }

  move = (e: MouseEvent) => {
    const dx = e.clientX - this.startX
    const dy = e.clientY - this.startY
    call(this.props.onDrag, e, {dx, dy})
  }

  up = () => {
    this.cleanup()
    call(this.props.onEnd)
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
        style={this.props.style}
        className={classNames(
          `align-${this.props.position}`,
          this.props.className,
          {
            debug: this.props.debug,
            showOnHover: this.props.showOnHover,
          }
        )}
        onMouseDown={this.down}
      />
    )
  }
}
