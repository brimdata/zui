import {LoadFormat} from "@brimdata/zed-js"
import * as ops from "./operations"
import * as handlers from "./handlers"

export type LoadFormData = {
  windowId: string
  poolId: string
  name?: string | null
  key?: string | null
  order?: "asc" | "desc" | null
  query?: string
  shaper?: string
  format?: LoadFormat
  files: string[]
  author: string
  body: string
}

export type LoadsOperations = {
  "loads.create": typeof ops.create
  "loads.preview": typeof ops.preview
  "loads.abortPreview": typeof ops.abortPreview
  "loads.abort": typeof ops.abort
  "loads.paste": typeof ops.paste
  "loads.cancel": typeof ops.cancel
}

export type LoadsHandlers = {
  "loads.chooseFiles": typeof handlers.chooseFiles
  "loads.previewLoadFiles": typeof handlers.previewLoadFiles
}
