import {TypeType} from "./type-type"

test("primitive types", () => {
  const typeValue = TypeType.create("string", {})

  expect(typeValue.toString()).toEqual("string")
})
