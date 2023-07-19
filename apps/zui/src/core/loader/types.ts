import {LoadFormat} from "@brimdata/zed-js"
import {LoadContext} from "./load-context"

export type LoadOptions = {
  lakeId: string
  poolId: string
  branch: string
  files: string[]
  format?: LoadFormat
}

export interface Loader {
  when(context: LoadContext): PromiseLike<boolean> | boolean
  run(context: LoadContext): PromiseLike<void> | void
  rollback(context: LoadContext): PromiseLike<void> | void
}
