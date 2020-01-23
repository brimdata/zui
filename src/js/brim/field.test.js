/* @flow */
import brim from "./"

test("null does not quote", () => {
  let f = brim.field({name: "service", type: "string", value: null})

  expect(f.queryableValue()).toEqual("null")
})

test("string does quote", () => {
  let f = brim.field({name: "service", type: "string", value: "d,n,s"})

  expect(f.queryableValue()).toEqual('"d,n,s"')
})
