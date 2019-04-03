/* @flow */
import {connect} from "react-redux"
import React from "react"

import {type DispatchProps} from "../../reducers/types"
import type {TableColumn} from "../../types"
import {updateTableColumns} from "../../actions/tableColumnSets"
import columnKey from "../../lib/columnKey"
import dispatchToProps from "../../lib/dispatchToProps"

let oldWidth = null
let start = null

type OwnProps = {|
  column: TableColumn,
  tableId: string
|}

type Props = {|
  ...DispatchProps,
  ...OwnProps
|}

export default class ColResizer extends React.PureComponent<Props> {
  move = (e: MouseEvent) => {
    if (start !== null) {
      const {column} = this.props
      const moved = e.clientX - start
      const update = {[columnKey(column)]: {width: oldWidth + moved}}
      this.props.dispatch(updateTableColumns(this.props.tableId, update))
    }
  }

  up = (_e: MouseEvent) => {
    remove("mousemove", this.move)
    remove("mouseup", this.up)
  }

  down = (e: MouseEvent) => {
    oldWidth = this.props.column.width
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
