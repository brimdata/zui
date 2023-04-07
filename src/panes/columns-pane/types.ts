import {zed} from "@brimdata/zed-js"

export type ColumnTreeData = {
  id: string
  name: string
  field: zed.TypeField
  children?: ColumnTreeData[]
}
