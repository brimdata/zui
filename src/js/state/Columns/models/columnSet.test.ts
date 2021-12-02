import {toZJSON} from "test/shared/zq"
import {ZealotContext} from "zealot-old"
import {Schema} from "zealot-old/zed"
import {createColumnSet} from "./columnSet"

function getColumns(zson: string) {
  const objects = toZJSON(zson)
  const records = ZealotContext.decode(objects)
  const schemaMap = records.reduce((map, obj) => {
    const name = obj.type.id
    const type = obj.type
    map[name] = new Schema(name, type)
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
