import {LoadFormat} from "@brimdata/zed-js"

export type LoadOptions = {
  windowId: string
  lakeId: string
  poolId: string
  branch: string
  files: string[]
  shaper: string
  format?: LoadFormat
  author: string
  body: string
}

export interface Loader {
  when(): PromiseLike<boolean> | boolean
  run(): PromiseLike<void> | void
  rollback?(): PromiseLike<void> | void
}
