import {LoadFormat} from "../../../../../packages/superdb-types/dist"
import {LoadContext} from "./load-context"
import {LoadReference} from "src/js/state/Loads/types"

export type LoadOptions = {
  windowId: string
  lakeId: string
  poolId: string
  branch?: string
  files: string[]
  query?: string
  shaper?: string
  format?: LoadFormat
  author: string
  body: string
}

export interface Loader {
  when(): PromiseLike<boolean> | boolean
  run(): PromiseLike<void> | void
  rollback?(): PromiseLike<void> | void
}

export type LoadEvents = {
  success: (load: LoadReference) => void
  abort: (load: LoadReference) => void
  error: (load: LoadReference) => void
}

export type LoaderRef = {
  name: string
  initialize: (ctx: LoadContext) => Loader
}
