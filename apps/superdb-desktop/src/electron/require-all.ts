import fs from "fs"
import {join} from "path"

export default function requireAll(directory: string) {
  const files = fs
    .readdirSync(directory)
    .map((f) => join(directory, f.replace(/\.(js|ts)$/, "")))
  return files.map((f) => {
    try {
      return require(f)
    } catch (e) {
      console.error("Could not require: " + f)
      console.error(e)
      throw e
    }
  })
}
