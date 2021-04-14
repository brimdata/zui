import {execSync} from "child_process"
import {parse} from "./zjson"

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
  const list = parse(zq("*", file))
  const chart = parse(zq("count() by typeof(.)", file))

  // I need the name of the typedef
  console.log(list.zjson.map((o) => o.types))
  console.log(chart.zjson.map((o) => o.types))
  // console.log(list.rows.map((r) => r._name))
  // console.log(chart.rows.map((r) => r.fields[0]))
})
