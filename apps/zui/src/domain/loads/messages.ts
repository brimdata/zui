import {LoadFormat} from "@brimdata/zed-js"
import * as handlers from "./handlers"
import * as ops from "./operations"

export type LoadFormData = {
  windowId: string
  poolId: string
  name: string | null
  key: string | null
  order: "asc" | "desc" | null
  files: string[]
  author: string
  body: string
  shaper: string
  format: LoadFormat
}

export type LoadersOperations = {
  "loaders.submit": typeof ops.submit
  "loaders.preview": typeof ops.preview
  "loaders.getFileTypes": typeof ops.getFileTypes
  "loaders.abortPreview": typeof ops.abortPreview
  "loaders.quickLoad": typeof ops.quickLoad
  "loaders.abort": typeof ops.abort
}

export type LoadersHandlers = {
  "loaders.previewLoadFiles": typeof handlers.previewLoadFiles
  "loaders.chooseFiles": typeof handlers.chooseFiles
  "loaders.quickLoadFiles": typeof handlers.quickLoadFiles
}
