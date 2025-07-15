import {execSync} from "child_process"
import {join} from "path"
import {jsup} from "../../../../../packages/superdb-types/dist"
import os from "os"

export function toJSUP(sup: string): jsup.Obj[] {
  let zq = join(__dirname, "../../zdeps/zq")
  if (os.platform() === "win32") zq += ".exe"
  const cmd = `${zq} -f jsup -`
  const result = execSync(cmd, {encoding: "utf-8", input: sup})
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
