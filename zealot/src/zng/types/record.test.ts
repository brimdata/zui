import * as zjson from "../../zjson"
import {Record} from "./record"

describe("flatten", () => {
  const columns = [
    {name: "nested", type: "record", of: [{name: "i", type: "int64"}]},
    {name: "s", type: "string"}
  ] as zjson.Column[]

  test("unset top-level record", () => {
    const r1 = new Record(columns, null)
    expect(r1.flatten()).toEqual({
      "type": [{"name": "nested.i", "type": "int64"}, {"name": "s", "type": "string"}],
      "value": [null, null]
    })
  })

  test("unset nested record", () => {
    const r2 = new Record(columns, [null, "hello"])
    expect(r2.flatten()).toEqual({
      "type": [{"name": "nested.i", "type": "int64"}, {"name": "s", "type": "string"}],
      "value": [null, "hello"]
    })
  })
})
