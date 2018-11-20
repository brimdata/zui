import React from "react"

let oldWidth = null
let start = null

export default class ColResizer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.move = this.move.bind(this)
    this.up = this.up.bind(this)
    this.down = this.down.bind(this)
  }

  move(e) {
    const {col} = this.props
    const moved = e.clientX - start

    const newWidth = oldWidth + moved

    // window.updateApp("RESIZE_COL", {[col]: newWidth})
  }

  up() {
    remove("mousemove", this.move)
    remove("mouseup", this.up)
  }

  down(e) {
    console.log("DOWN")
    oldWidth = this.props.width
    start = e.clientX
    add("mousemove", this.move)
    add("mouseup", this.up)
  }

  render() {
    return <div className="col-resizer" onMouseDown={this.down} />
  }
}

const add = (...args) => {
  document.addEventListener(...args)
}

const remove = (...args) => {
  document.removeEventListener(...args)
}
