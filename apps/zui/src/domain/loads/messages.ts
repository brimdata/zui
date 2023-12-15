import {LoadFormat} from "@brimdata/zed-js"
import * as ops from "./operations"
import * as handlers from "./handlers"

export type LoadFormData = {
  windowId: string
  poolId: string
  name?: string | null
  key?: string | null
  order?: "asc" | "desc" | null
  files: string[]
  author: string
  body: string
  shaper?: string
  format?: LoadFormat
}

export type LoadsOperations = {
  "loads.create": typeof ops.submit
  "loads.preview": typeof ops.preview
  "loads.getFileTypes": typeof ops.getFileTypes
  "loads.abortPreview": typeof ops.abortPreview
  "loads.abort": typeof ops.abort
  "loads.paste": typeof ops.paste
  "loads.cancel": typeof ops.cancel
}

export type LoadsHandlers = {
  "loads.chooseFiles": typeof handlers.chooseFiles
  "loads.previewLoadFiles": typeof handlers.previewLoadFiles
}
