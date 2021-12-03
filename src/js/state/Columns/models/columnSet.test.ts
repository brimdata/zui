import {decode, zed} from "@brimdata/zealot"
import {toZJSON} from "test/shared/zq"
import {createColumnSet} from "./columnSet"

function getColumns(zson: string) {
  const objects = toZJSON(zson)
  const records = decode(objects)
  const schemaMap = records.reduce((map, obj) => {
    const name = obj.type.id
    const type = obj.type
    map[name] = new zed.Schema(name, type)
    return map
  }, {})
  return createColumnSet(schemaMap)
    .getUniqColumns()
    .map((c) => c.name)
}

const tests = {
  '{s:"foo"}(=foo)': ["s"],
  '{s:"foo"}': ["s"],
  '{s: {a: "foo", b: "bar"}}': [
    ["s", "a"],
    ["s", "b"]
  ],
  '{s: {a: "foo", b: "bar"}(=nest)}': [
    ["s", "a"],
    ["s", "b"]
  ],
  '{s: "foo"} {f: "bar"}': ["s", "f"],
  '{s: "foo"}(=s) {f: "bar"}(=f)': ["s", "f"]
}

for (let [zson, columns] of Object.entries(tests)) {
  test(`get uniq columns for ${zson}`, () => {
    expect(getColumns(zson)).toEqual(columns)
  })
}
