/* @flow */

import React from "react"
import {connect} from "react-redux"
import * as columnWidths from "../../actions/columnWidths"
import type {Width} from "./Layout"
import {type DispatchProps} from "../../reducers/types"
import dispatchToProps from "../../lib/dispatchToProps"

let oldWidth = null
let start = null

type OwnProps = {|
  col: string,
  width: Width
|}

type Props = {|
  ...DispatchProps,
  ...OwnProps
|}

export default class ColResizer extends React.PureComponent<Props> {
  move = (e: MouseEvent) => {
    if (start !== null) {
      const {col} = this.props
      const moved = e.clientX - start
      const newWidth = oldWidth + moved
      this.props.dispatch(columnWidths.setWidths({[col]: newWidth}))
    }
  }

  up = (_e: MouseEvent) => {
    remove("mousemove", this.move)
    remove("mouseup", this.up)
  }

  down = (e: MouseEvent) => {
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

export const XColResizer = connect<Props, OwnProps, _, _, _, _>(
  null,
  dispatchToProps
)(ColResizer)
