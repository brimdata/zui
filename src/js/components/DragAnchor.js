import React from "react"

export default class DragAnchor extends React.Component {
  constructor(props) {
    super(props)
    this.down = this.down.bind(this)
    this.up = this.up.bind(this)
    this.move = this.move.bind(this)
  }

  componentWillUnmount() {
    this.up()
  }

  down() {
    document.addEventListener("mousemove", this.move)
    document.addEventListener("mouseup", this.up)
  }

  move(e) {
    this.props.onDrag(e)
  }

  up() {
    document.removeEventListener("mousemove", this.move)
    document.removeEventListener("mouseup", this.up)
  }

  render() {
    return (
      <div
        className={`drag-anchor drag-anchor-${this.props.position}`}
        onMouseDown={this.down}
      />
    )
  }
}
