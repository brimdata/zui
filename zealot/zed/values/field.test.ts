import {createRecord} from "test/shared/factories/zed-factory"

test("field path", () => {
  const r = createRecord({id: {person: "alice"}})
  const f = r.getField(["id", "person"])

  expect(f.value.toString()).toBe("alice")
  expect(f.name).toBe("person")
  expect(f.path).toEqual(["id", "person"])
})
