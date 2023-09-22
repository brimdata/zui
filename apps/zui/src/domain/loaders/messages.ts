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
  message: string
  shaper: string
  format: LoadFormat
}

export type LoadersOperations = {
  "loaders.formAction": typeof ops.formAction
  "loaders.previewShaper": typeof ops.previewShaper
  "loaders.getFileTypes": typeof ops.getFileTypes
}

export type LoadersHandlers = {
  "loaders.loadFiles": typeof loadFiles
  "loaders.chooseAndLoadFiles": typeof chooseAndLoadFiles
}
