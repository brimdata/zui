import {execSync} from "child_process"
import {ZedContext} from "./context"

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
  const input = zq("*", file)
  const ctx = new ZedContext()
  const list = ctx.decode(input)
  // const json = list.rows.map((row) => row.serialize())
  // const list2 = json.map(deserialize)

  // expect(list2).toEqual(list.rows)
})
