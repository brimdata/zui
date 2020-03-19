/* @flow */
import lib from "./"
import tmp from "tmp"

let tmpFile = ""

beforeAll(() => {
  tmpFile = tmp.fileSync().name
})

afterAll(() => {
  return lib
    .file(tmpFile)
    .remove()
    .catch((_e) => {})
})

test("keep set", () => {
  let keep = lib.keep(tmpFile, {name: ""}).set("name", "james")

  expect(keep.get("name")).toBe("james")
})

test("set deep nesting", () => {
  let data = {
    person: {name: {first: ""}}
  }
  let keep = lib.keep(tmpFile, data).set("person.name.first", "james")

  expect(keep.get("person.name.first")).toBe("james")
})

test("keep set when key does not exist", () => {
  expect(() => lib.keep(tmpFile, {name: ""}).set("age", 11)).toThrow(
    "Unknown Key 'age': Update the expected data shape in the defaults object."
  )
})

test("keep save", async () => {
  let data = {name: "", age: null}

  await lib.keep(tmpFile, data).save()
  expect(await lib.file(tmpFile).read()).toEqual(`{
  "name": "",
  "age": null
}`)
})

test("keep load", async () => {
  let init = {name: "", age: null}
  let saved = {name: "James", age: 28}
  await lib.file(tmpFile).write(lib.obj(saved).toString(2))

  let keep = lib.keep(tmpFile, init)
  await keep.load()

  expect(keep.get("name")).toBe("James")
})

test("keep load if file does not exist", async () => {
  let init = {}
  return lib.keep(tmpFile + "-nope.js", init).load()
})
