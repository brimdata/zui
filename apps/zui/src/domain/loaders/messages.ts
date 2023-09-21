import {LoadFormat, zjson} from "@brimdata/zed-js"
import {chooseAndLoadFiles, loadFiles} from "./handlers"

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
  "loaders.formAction": (data: LoadFormData) => void
  "loaders.previewShaper": (
    files: string[],
    shaper: string,
    format: LoadFormat
  ) => {data: zjson.Obj[]; error: string | null}
  "loaders.getFileTypes": (paths: string[]) => {type: string; path: string}[]
}

export type LoadersHandlers = {
  "loaders.loadFiles": typeof loadFiles
  "loaders.chooseAndLoadFiles": typeof chooseAndLoadFiles
}
