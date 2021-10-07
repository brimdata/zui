import {execSync} from "child_process"
import fs from "fs"
import {join} from "path"
import tmp from "tmp"

export function toZJSON(zson) {
  const file = tmp.fileSync()
  fs.writeFileSync(file.name, zson, {encoding: "utf-8"})
  const zed = join(__dirname, "../../zdeps/zed")
  const cmd = `${zed} query -f zjson '*' "${file.name}"`
  const result = execSync(cmd, {encoding: "utf-8"})
  return result
    .trim()
    .split("\n")
    .map((s) => {
      try {
        return JSON.parse(s)
      } catch (e) {
        console.error(result)
        throw e
      }
    })
}
