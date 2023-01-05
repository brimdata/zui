import {ZedTableApi} from "./zed-table-api"
import {ZedTableProps} from "./types"

export function createZedTable({
  shape,
  values,
  state,
  ...handlers
}: ZedTableProps) {
  return new ZedTableApi(shape, values, state, handlers)
}
