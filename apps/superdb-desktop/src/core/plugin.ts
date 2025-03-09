import path from "path"
import {app} from "electron"
import fs from "fs-extra"

export type PluginContext = {
  storagePath: string
}

export function createPluginContext(directory: string) {
  const name = path.basename(directory)
  const storagePath = path.join(
    app.getPath("userData"),
    "plugins",
    name,
    "storage"
  )
  fs.ensureDirSync(storagePath)

  return {
    storagePath,
  }
}
