import fs from "fs"
import {join} from "path"

export default async function requireAll(directory: string) {
  const files = fs.readdirSync(directory).map((f) => join(directory, f))
  return files.map((f) => require(f))
}
