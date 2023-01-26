import {diffKeys} from "./diff-keys"

test("diff keys", () => {
  const a = {"1": true, "2": true}
  const b = {}

  const keys = diffKeys(a, b)
  expect(keys).toEqual(["1", "2"])
})

test("diff keys 2", () => {
  const a = {"1": true, "2": true}
  const b = {"1": true}

  const keys = diffKeys(a, b)
  expect(keys).toEqual(["2"])
})

test("diff keys 3", () => {
  const a = {"1": true, "2": true}
  const b = {"1": true, "2": false}

  const keys = diffKeys(a, b)
  expect(keys).toEqual(["2"])
})
