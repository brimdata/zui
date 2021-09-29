import {createRecord} from "test/shared/factories/zed-factory"

test("has with array", () => {
  const r = createRecord({id: {person: "alice"}})

  expect(r.has(["id", "person"])).toBe(true)
})
