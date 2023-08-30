import {LoadFormat, zjson} from "@brimdata/zed-js"

export type LoadFormData = {
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
}
