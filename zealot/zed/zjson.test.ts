import {execSync} from "child_process"
import {decode} from "./zjson"

function zq(q, file) {
  const zed = "/Users/jkerr/tools/go/bin/zed"
  const cmd = `${zed} query -f zjson "${q}" ${file}`
  return execSync(cmd, {encoding: "utf-8"})
    .trim()
    .split("\n")
    .map((s) => JSON.parse(s))
}

test("can correlate?", () => {
  const file = "test/data/count-by-typeof.zson"
  const _list = decode(zq("*", file))
  const _chart = decode(zq("count() by typeof(.)", file))
})
