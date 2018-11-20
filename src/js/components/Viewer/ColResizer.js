import React from "react"
import {connect} from "react-redux"
import * as columnWidths from "../../actions/columnWidths"

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
    this.props.dispatch(columnWidths.setWidths({[col]: newWidth}))
  }

  up() {
    remove("mousemove", this.move)
    remove("mouseup", this.up)
  }

  down(e) {
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

export const XColResizer = connect()(ColResizer)
