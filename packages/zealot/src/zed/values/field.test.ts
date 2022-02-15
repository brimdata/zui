import {zq} from "../../cmd/zq"
import {DefaultContext, zed} from "../../index"
import {createRecord} from "../../test/factory"

test("field path", () => {
  const r = createRecord({id: {person: "alice"}})
  const f = r.getField(["id", "person"])

  expect(f.value.toString()).toBe("alice")
  expect(f.name).toBe("person")
  expect(f.path).toEqual(["id", "person"])
})

test("field path with nested named types", async () => {
  const objects = await zq({
    input: '{a: {b: {c: "foo"}(=c)}(=b)}(=a)',
    format: "zjson"
  })
  const rows = DefaultContext.decode(objects) as zed.Record[]
  const field = rows[0].getField(["a", "b", "c"])
  expect(field.path).toEqual(["a", "b", "c"])
  expect(field.rootRecord === rows[0]).toBe(true)
})

test("field path with nested unnamed types", async () => {
  const objects = await zq({input: '{a: {b: {c: "foo"}}}', format: "zjson"})
  const rows = DefaultContext.decode(objects) as zed.Record[]
  const field = rows[0].getField(["a", "b", "c"])
  expect(field.path).toEqual(["a", "b", "c"])
  expect(field.rootRecord === rows[0]).toBe(true)
})
