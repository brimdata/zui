/* @flow */
import buildUrl from "./buildUrl"

test("#buildUrl", () => {
  const url = buildUrl("localhost", 99, "/search", {foo: "bar", blah: "12"})

  expect(url).toBe("http://localhost:99/search?foo=bar&blah=12")
})

test("#buildUrl whith no params", () => {
  const url = buildUrl("demo.looky.cloud", 10, "/search")

  expect(url).toBe("http://demo.looky.cloud:10/search")
})
