import {LoadFormat} from "@brimdata/zed-js"
import {chooseAndLoadFiles, loadFiles} from "./handlers"
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
}

export type LoadersHandlers = {
  "loaders.loadFiles": typeof loadFiles
  "loaders.chooseAndLoadFiles": typeof chooseAndLoadFiles
}
