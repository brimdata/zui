import fs from "fs-extra"
import path from "path"

export async function requireDir(options: {
  dir: string
  exclude?: RegExp
  run?: (code: any, file: string) => any
}) {
  const {dir, exclude, run} = options

  let count = 0
  for (let name of await fs.readdir(dir)) {
    if (exclude && exclude.test(name)) continue
    const sourceFile = path.join(dir, name)
    const code = require(sourceFile)
    if (run) await run(code, sourceFile)
    count++
  }
  return count
}
