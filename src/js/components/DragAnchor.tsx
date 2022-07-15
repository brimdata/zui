import React from "react"
import styled from "styled-components"

type Props = {
  position: "left" | "right"
  onDrag: Function
}

const Area = styled.div`
  width: 9px;
  position: absolute;
  top: 0;
  bottom: 0;
  background: transparent;
  pointer-events: all !important;
  cursor: col-resize;
  z-index: 99;

  &.align-left {
    left: -4px;
  }

  &.align-right {
    right: -4px;
  }
`

export default class DragAnchor extends React.Component<Props> {
  componentWillUnmount() {
    this.up()
  }

  down = () => {
    const body = document.body
    if (body) {
      body.classList.add("dragging")
      document.addEventListener("mousemove", this.move)
      document.addEventListener("mouseup", this.up)
    }
  }

  move = (e: Event) => {
    this.props.onDrag(e)
  }

  up = () => {
    const body = document.body
    if (body) {
      body.classList.remove("dragging")
      document.removeEventListener("mousemove", this.move)
      document.removeEventListener("mouseup", this.up)
    }
  }

  render() {
    return (
      <Area
        className={`align-${this.props.position}`}
        onMouseDown={this.down}
      />
    )
  }
}
