import {createRecord} from "test/shared/factories/zed-factory"
import {toZJSON} from "test/shared/zq"
import {ZealotContext} from "zealot"

test("field path", () => {
  const r = createRecord({id: {person: "alice"}})
  const f = r.getField(["id", "person"])

  expect(f.value.toString()).toBe("alice")
  expect(f.name).toBe("person")
  expect(f.path).toEqual(["id", "person"])
})

test("field path with nested named types", () => {
  const rows = ZealotContext.decode(toZJSON('{a: {b: {c: "foo"}(=c)}(=b)}(=a)'))
  const field = rows[0].getField(["a", "b", "c"])
  expect(field.path).toEqual(["a", "b", "c"])
  expect(field.rootRecord === rows[0]).toBe(true)
})

test("field path with nested unnamed types", () => {
  const rows = ZealotContext.decode(toZJSON('{a: {b: {c: "foo"}}}'))
  const field = rows[0].getField(["a", "b", "c"])
  expect(field.path).toEqual(["a", "b", "c"])
  expect(field.rootRecord === rows[0]).toBe(true)
})
