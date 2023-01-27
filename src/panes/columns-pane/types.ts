import {zed} from "@brimdata/zealot"

export type ColumnTreeData = {
  id: string
  name: string
  field: zed.TypeField
  children?: ColumnTreeData[]
}
