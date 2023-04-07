import {zed} from "@brimdata/zed-js"
import {isNumber} from "lodash"
import {ViewContext} from "../value-view/view-context"
import {RowData} from "../../../app/features/inspector/types"
import {createView} from "../../../app/features/inspector/views/create"
import {ListViewArgs} from "./types"

/**
 * This calculates the total number of
 * rows there will be taking into account the expanded states of
 * the values, then only fills in the rows that are visible at
 * that moment. It caches the rows when scrolling as well.
 *
 * It's like a map in an exploration computer game. The rows get
 * filled in more and more as you travel (scroll) around.
 */
export class ListViewApi {
  count = 0
  rows = [] as (RowData | null)[]
  rowToValue: number[] = []
  valueToRow: number[] = []
  rendered: {startIndex: number; stopIndex: number}

  constructor(public args: ListViewArgs) {
    const ctx = this.createViewContext()
    args.values.forEach((value, index) => {
      const rowCount = createView({
        ctx,
        value,
        field: null,
        key: null,
        last: true,
        type: value.type,
        indexPath: [index],
      }).rowCount()
      this.rowToValue = this.rowToValue.concat(Array(rowCount).fill(index))
      this.valueToRow.push(this.count)
      this.count += rowCount
    })
    this.rows = Array(this.count).fill(null)
    this.rendered = {startIndex: 0, stopIndex: 0}
  }

  fill() {
    const {startIndex, stopIndex} = this.rendered
    const valStart = this.rowToValue[startIndex]
    const valStop = this.rowToValue[stopIndex]
    if (!isNumber(valStart) || !isNumber(valStop)) return

    for (let index = valStart; index <= valStop; index++) {
      const rowIndex = this.valueToRow[index]
      const value = this.args.values[index]
      if (this.rows[rowIndex]) continue
      const newRows = this.inspect(value, index)
      this.rows.splice(rowIndex, newRows.length, ...newRows)
    }
  }

  private inspect(value: zed.Value, index: number) {
    const ctx = this.createViewContext()
    createView({
      ctx,
      value,
      field: null,
      key: null,
      last: true,
      type: value.type,
      indexPath: [index],
    }).inspect()
    return ctx.rows
  }

  private createViewContext() {
    return new ViewContext({
      ...this.args.viewConfig,
      pageState: this.args.valuePageState,
      expandedDefaultState: this.args.valueExpandedDefaultState,
      expandedState: this.args.valueExpandedState,
      onClick: this.args.valueProps?.onClick ?? (() => {}),
      onContextMenu: this.args.valueProps?.onContextMenu ?? (() => {}),
    })
  }

  onScroll(pos: {top: number; left: number}) {
    return this.args?.onScroll(pos, this)
  }

  nearBottom(n: number) {
    return this.rendered.stopIndex >= this.count - n
  }
}
