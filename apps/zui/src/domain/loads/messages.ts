import {LoadFormat} from "@brimdata/zed-js"
import * as ops from "./operations"

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

export type LoadersOperations = {
  "loads.create": typeof ops.submit
  "loads.preview": typeof ops.preview
  "loads.getFileTypes": typeof ops.getFileTypes
  "loads.abortPreview": typeof ops.abortPreview
  "loads.abort": typeof ops.abort
}

export type LoadersHandlers = {}
