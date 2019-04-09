/* @flow */

import {getDeepTypes} from "./getDeepTypes"

test("gets types for a simple object", () => {
  const obj = {
    name: "james",
    age: 23
  }

  expect(getDeepTypes(obj)).toEqual({
    name: "String",
    age: "Number"
  })
})

test("gets types for a nested object", () => {
  const obj = {
    name: "james",
    age: 23,
    stats: {
      fast: true
    }
  }

  expect(getDeepTypes(obj)).toEqual({
    name: "String",
    age: "Number",
    stats: {
      fast: "Boolean"
    }
  })
})

test("gets types for arrays object", () => {
  const obj = {
    fun: ["a", null, false]
  }

  expect(getDeepTypes(obj)).toEqual({
    fun: ["String", "Null", "Boolean"]
  })
})
