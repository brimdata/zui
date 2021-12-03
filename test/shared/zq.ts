import {execSync} from "child_process"
import {join} from "path"
import {zjson} from "@brimdata/zealot"

export function toZJSON(zson: string): zjson.RootRecord[] {
  const zed = join(__dirname, "../../zdeps/zed")
  const cmd = `${zed} query -f zjson -`
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
