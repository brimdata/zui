import {createRecord} from "../../test/factory"
import {toZJSON} from "../../test/zq"
import {DefaultContext} from "../../index"

test("field path", () => {
  const r = createRecord({id: {person: "alice"}})
  const f = r.getField(["id", "person"])

  expect(f.value.toString()).toBe("alice")
  expect(f.name).toBe("person")
  expect(f.path).toEqual(["id", "person"])
})

test("field path with nested named types", () => {
  const rows = DefaultContext.decode(
    toZJSON('{a: {b: {c: "foo"}(=c)}(=b)}(=a)')
  )
  const field = rows[0].getField(["a", "b", "c"])
  expect(field.path).toEqual(["a", "b", "c"])
  expect(field.rootRecord === rows[0]).toBe(true)
})

test("field path with nested unnamed types", () => {
  const rows = DefaultContext.decode(toZJSON('{a: {b: {c: "foo"}}}'))
  const field = rows[0].getField(["a", "b", "c"])
  expect(field.path).toEqual(["a", "b", "c"])
  expect(field.rootRecord === rows[0]).toBe(true)
})
