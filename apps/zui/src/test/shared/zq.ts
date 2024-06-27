import {execSync} from "child_process"
import {join} from "path"
import {zjson} from "@brimdata/zed-js"
import os from "os"

export function toZJSON(zson: string): zjson.Obj[] {
  let zq = join(__dirname, "../../zdeps/zq")
  if (os.platform() === "win32") zq += ".exe"
  const cmd = `${zq} -f zjson -`
  const result = execSync(cmd, {encoding: "utf-8", input: zson})
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
