import * as zed from "../../../../../packages/superdb-types/dist"

export type ColumnTreeData = {
  id: string
  name: string
  field: zed.TypeField
  children?: ColumnTreeData[]
}
