import {execSync} from "child_process"

export function toZJSON(zson: string) {
  const zed = "npx zq"
  const cmd = `${zed} -f zjson -`
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
