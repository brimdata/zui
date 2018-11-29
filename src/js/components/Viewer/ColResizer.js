/* @flow */

import React from "react"
import type {Dispatch} from "redux"
import {connect} from "react-redux"
import * as columnWidths from "../../actions/columnWidths"
import type {Width} from "./Layout"

let oldWidth = null
let start = null

type Props = {
  col: string,
  width: Width,
  dispatch: Dispatch<*>
}

export default class ColResizer extends React.PureComponent<Props> {
  move: MouseEvent => void
  up: MouseEvent => void
  down: MouseEvent => void

  constructor(props: Props) {
    super(props)
    this.move = this.move.bind(this)
    this.up = this.up.bind(this)
    this.down = this.down.bind(this)
  }

  move(e: MouseEvent) {
    if (start !== null) {
      const {col} = this.props
      const moved = e.clientX - start
      const newWidth = oldWidth + moved
      this.props.dispatch(columnWidths.setWidths({[col]: newWidth}))
    }
  }

  up(_e: MouseEvent) {
    remove("mousemove", this.move)
    remove("mouseup", this.up)
  }

  down(e: MouseEvent) {
    oldWidth = this.props.width
    start = e.clientX
    add("mousemove", this.move)
    add("mouseup", this.up)
  }

  render() {
    return <div className="col-resizer" onMouseDown={this.down} />
  }
}

const add = document.addEventListener
const remove = document.removeEventListener

export const XColResizer = connect()(ColResizer)
