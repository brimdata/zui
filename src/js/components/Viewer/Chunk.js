/* @flow */

import React from "react"
import isEqual from "lodash/isEqual"

import type {RowRenderer, ViewerDimens} from "../../types"
import Log from "../../models/Log"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"

type Props = {
  selectedLog: ?Log,
  rowRenderer: RowRenderer,
  columns: TableColumns,
  dimens: ViewerDimens,
  rows: number[],
  logs: Log[]
}

export default class Chunk extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (!isEqual(this.props.rows, nextProps.rows)) {
      return true
    }

    if (!isEqual(this.props.columns, nextProps.columns)) {
      return true
    }

    if (this.props.selectedLog !== nextProps.selectedLog) {
      return true
    }

    if (this.props.dimens.rowWidth !== nextProps.dimens.rowWidth) {
      return true
    }

    for (let index of this.props.rows) {
      if (!Log.isSame(this.props.logs[index], nextProps.logs[index]))
        return true
    }

    return false
  }

  render() {
    const {rowRenderer, dimens, rows} = this.props
    return (
      <div className="chunk" style={Styler.chunk(dimens, rows[0], rows.length)}>
        {rows.map(index => rowRenderer(index, dimens))}
      </div>
    )
  }
}
