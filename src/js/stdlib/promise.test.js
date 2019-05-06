/* @flow */

import {serially} from "./promise"

test("running with three promises", () => {
  let p1 = Promise.resolve("1")
  let p2 = Promise.resolve("2")
  let p3 = Promise.resolve("3")

  return expect(serially([p1, p2, p3])).resolves.toEqual(["1", "2", "3"])
})

test("running with timeout", () => {
  let p1 = Promise.resolve("1")
  let p2 = new Promise((r) => setTimeout(() => r("2"), 10))
  let p3 = Promise.resolve("3")

  return expect(serially([p1, p2, p3])).resolves.toEqual(["1", "2", "3"])
})

test("running with literal values", () => {
  let p1 = Promise.resolve("1")
  let p2 = "2"
  let p3 = "3"

  return expect(serially([p1, p2, p3])).resolves.toEqual(["1", "2", "3"])
})

test("rejects the first value", () => {
  let p1 = Promise.resolve("1")
  let p2 = Promise.reject("boom")
  let p3 = "3"

  return expect(serially([p1, p2, p3])).rejects.toEqual("boom")
})

test("rejects the first value and not the second", () => {
  let p1 = Promise.resolve("1")
  let p2 = Promise.reject("boom")
  let p3 = new Promise((_, rej) => setTimeout(() => rej("2"), 10))

  return expect(serially([p1, p2, p3])).rejects.toEqual("boom")
})
