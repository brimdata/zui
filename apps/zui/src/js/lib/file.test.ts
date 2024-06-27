import file from "./file"
import tmp from "tmp"

let tmpFile

beforeAll(() => {
  tmpFile = tmp.fileSync().name
})

afterAll(() => {
  return
  file(tmpFile)
    .remove()
    .catch((_e) => {})
})

test("file exists", async () => {
  const exists = await file("no" + __filename).exists()

  expect(exists).toBe(false)
})

test("file exists true", async () => {
  const exists = await file(__filename).exists()

  expect(exists).toBe(true)
})

test("file write", () => {
  return file(tmpFile).write("{}")
})

test("file read", async () => {
  const contents = await file(tmpFile).read()

  expect(contents).toEqual("{}")
})

test("file remove", async () => {
  return file(tmpFile).remove()
})
