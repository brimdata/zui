import {execSync} from "child_process"
import {deserialize} from "./json"
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
  const file = "test/data/sample.zson"
  const list = decode(zq("*", file))
  const json = list.rows.map((row) => row.serialize())
  const list2 = json.map(deserialize)

  expect(list2).toEqual(list.rows)
})
