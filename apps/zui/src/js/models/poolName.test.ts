import {createPoolName} from "./poolName"

test("removes slashes at the front", () => {
  expect(createPoolName("/file")).toEqual("file")
})

test("removes slashes at the end", () => {
  expect(createPoolName("file/")).toEqual("file")
})

test("removes slashes at both sides", () => {
  expect(createPoolName("/file/")).toEqual("file")
})

test("replaces slashes with underscore", () => {
  expect(createPoolName("/file/this/that/cool")).toEqual("file_this_that_cool")
})

test("an emoji", () => {
  expect(createPoolName("🐘")).toBe("🐘")
})

test("empty name", () => {
  expect(createPoolName("")).toBe("Untitled")
})

test("trims pool", () => {
  expect(createPoolName("    name     ")).toBe("name")
})
