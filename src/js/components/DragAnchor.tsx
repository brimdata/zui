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
  z-index: 99;

  &.align-left {
    left: -5px;
    cursor: col-resize;
  }

  &.align-right {
    right: -5px;
    cursor: col-resize;
  }
`

export default class DragAnchor extends React.Component<Props> {
  componentWillUnmount() {
    this.up()
  }

  down = () => {
    const body = document.body
    if (body) {
      body.classList.add("no-select", "col-resize")
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
      body.classList.remove("no-select", "col-resize")
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
