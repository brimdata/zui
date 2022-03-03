import {zed} from "@brimdata/zealot"
import {isNumber} from "lodash"
import {ReactNode} from "react"
import {InspectorProps, RowData} from "./types"
import {createView} from "./views/create"

/**
 * Not sure about this name. This class makes the inspector render
 * fast with thousands of rows. It calculates the total number of
 * rows there will be taking into account the expanded states of
 * the values, then only fills in the rows that are visible at
 * that moment. It caches the rows when scrolling as well.
 *
 * It's like a map in an exploration computer game. The rows get
 * filled in more and more as you travel (scroll) around.
 */
export class InspectList {
  count = 0
  rows = [] as (RowData | null)[]
  rowToValue: number[] = []
  valueToRow: number[] = []

  constructor(public props: InspectorProps) {
    const ctx = new InspectContext(this.props)
    props.values.forEach((value, index) => {
      const rowCount = createView({
        ctx,
        value,
        field: null,
        key: null,
        last: true,
        type: value.type,
        indexPath: [index]
      }).rowCount()
      this.rowToValue = this.rowToValue.concat(Array(rowCount).fill(index))
      this.valueToRow.push(this.count)
      this.count += rowCount
    })
    this.rows = Array(this.count).fill(null)
  }

  fill([visibleStart, visibleStop]: [number, number]) {
    const valStart = this.rowToValue[visibleStart]
    const valStop = this.rowToValue[visibleStop]
    if (!isNumber(valStart) || !isNumber(valStop)) return

    for (let index = valStart; index <= valStop; index++) {
      const rowIndex = this.valueToRow[index]
      const value = this.props.values[index]
      if (this.rows[rowIndex]) continue
      const newRows = this.inspect(value, index)
      this.rows.splice(rowIndex, newRows.length, ...newRows)
    }
  }

  inspect(value: zed.Value, index: number) {
    const ctx = new InspectContext(this.props)
    createView({
      ctx,
      value,
      field: null,
      key: null,
      last: true,
      type: value.type,
      indexPath: [index]
    }).inspect()
    return ctx.rows
  }
}

export class InspectContext {
  indent = 0
  rows = [] as RowData[]
  constructor(public props: InspectorProps) {}

  nest() {
    this.indent += 1
  }

  unnest() {
    this.indent -= 1
  }

  push(render: ReactNode) {
    this.rows.push({
      render,
      indent: this.indent
    })
  }
}
