import reducer from "."

test("NEW_BRO_SCHEMA", () => {
  const newState = reducer(undefined, {
    type: "NEW_BRO_SCHEMA",
    spaceName: "default",
    id: "1",
    descriptor: ["...schema stuff"]
  })

  expect(newState.broSchemas).toEqual({
    "default.1": ["...schema stuff"]
  })
})
