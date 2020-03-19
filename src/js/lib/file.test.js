/* @flow */
import lib from "./"
import tmp from "tmp"

let tmpFile

beforeAll(() => {
  tmpFile = tmp.fileSync().name
})

afterAll(() => {
  return lib
    .file(tmpFile)
    .remove()
    .catch((_e) => {})
})

test("file exists", async () => {
  let exists = await lib.file("no" + __filename).exists()

  expect(exists).toBe(false)
})

test("file exists true", async () => {
  let exists = await lib.file(__filename).exists()

  expect(exists).toBe(true)
})

test("file write", () => {
  return lib.file(tmpFile).write("{}")
})

test("file read", async () => {
  let contents = await lib.file(tmpFile).read()

  expect(contents).toEqual("{}")
})

test("file remove", async () => {
  return lib.file(tmpFile).remove()
})
