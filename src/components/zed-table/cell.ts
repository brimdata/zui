import {zed} from "@brimdata/zealot"
import {InspectContext} from "src/app/features/inspector/inspect-context"
import {createView} from "src/app/features/inspector/views/create"
import {ZedTableApi} from "./zed-table-api"
import {View} from "src/app/features/inspector/views/view"
import {Position} from "./position"
import {PathView} from "src/app/query-home/results/path-view"
import {BareStringView} from "src/app/query-home/results/bare-string-view"

/**
 * There are several types of IDs
 *
 * 1. ColumnId "col:1,2,3"
 *    The numbers after the colon are the index path from the root record
 *    to this column. This happens only when there are nested records. If
 *    the root record is flat, there will only be one number, the index of
 *    the field to show in the column.
 *
 * 2. PositionId "pos:1,5"
 *    The numbers after the colon represent the columnIndex and rowIndex of
 *    the cell in the grid. Columns can be re-ordered, so the same column
 *    index may represent different columnIds without the underlying data
 *    changing.
 *
 * 4. RowId "row:99"
 *    The number represents the index in the array of data.
 *
 * 3. CellId "col:1,2,3_row:99"
 *    The columnId and the rowId joined with an underscore. This is different
 *    from a positionId because it will not change even when the columns are
 *    re-ordered.
 *
 * 4. ValueId: "val:1,2"
 *    The numbers represent the indexPath to a value within a value.
 *    If the root value is primitive, it will be 0. But if the value contains
 *    nested values, the numbers will represent the indexPath of the ancestor
 *    values needed to get to that value.
 *
 * 5. ViewId "col:1,2,3_row:99_val:1,2"
 *    This is used to determine if a value within a cell needs to be rendered
 *    as expanded or collapsed and how many pages of items should be shown.
 */

export class Cell {
  id: string
  view: View<zed.Any>
  columnId: string
  position: Position
  field: zed.Field
  value: zed.Value

  static createId(columnId: string, rowIndex: number) {
    const rowId = `row:${rowIndex}`
    return [columnId, rowId].join("_")
  }

  constructor(args: {
    api: ZedTableApi
    position: Position
    columnId: string
    field: zed.Field | null
  }) {
    this.id = Cell.createId(args.columnId, args.position.rowIndex)
    this.columnId = args.columnId
    this.position = args.position
    this.field = args.field
    this.value = args.field?.value ?? new zed.Null()
    this.view = createView({
      ctx: new InspectContext({
        customViews: [PathView, BareStringView],
        isExpanded: (key) => args.api.valueIsExpanded(this.viewId(key)),
        setExpanded: (key, value) => {
          args.api.setValueExpanded(this.viewId(key), value)
          args.api.cellChanged(this)
        },
        getValuePage: (key) => args.api.valuePage(this.viewId(key)),
        incValuePage: (key) => {
          const viewId = this.viewId(key)
          const page = args.api.valuePage(viewId)
          args.api.setValuePage(viewId, page + 1)
          args.api.cellChanged(this)
        },
        onContextMenu: (e, value, field) => {
          args.api.handlers.onValueContextMenu(e, value, field, this)
        },
        peekLimit: 1,
        lineLimit: 2,
        rowsPerPage: 25,
        rowLimit: 50,
      }),
      value: this.value,
      type: this.value.type,
      field: this.field,
      key: null,
      last: true,
      indexPath: [],
    })
  }

  get lineCount() {
    return this.view.rowCount()
  }

  valueId(path: string) {
    return `val:${path}`
  }

  viewId(valuePath: string) {
    return [this.id, this.valueId(valuePath)].join("_")
  }

  isInspected = false
  inspect() {
    if (this.isInspected) return
    this.view.inspect()
    this.isInspected = true
  }
}
