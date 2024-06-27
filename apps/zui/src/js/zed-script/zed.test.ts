import {createRecord} from "@brimdata/zed-js"
import zedScript from "./index"

test("zedScript when nested with identifiers", () => {
  const r = createRecord({one: {two: {three: "test"}}})
  const f = r.getField(["one", "two", "three"])

  expect(zedScript`${f}`).toBe("one.two.three")
})

test("zedScript with empty string name", () => {
  const r = createRecord({"": "test"})
  const f = r.getField("")

  expect(zedScript`${f}==${f.value}`).toBe('this[""]=="test"')
})

test("zedScript nested with dollar sign space", () => {
  const r = createRecord({one: {two: {"$ three": "test"}}})
  const f = r.getField(["one", "two", "$ three"])

  expect(zedScript`${f}`).toBe('one.two["$ three"]')
})

test("zedScript nested with underscores", () => {
  const r = createRecord({"_ 1": {two: {"$ 3": "test"}}})
  const f = r.getField(["_ 1", "two", "$ 3"])

  expect(zedScript`${f}`).toBe('this["_ 1"].two["$ 3"]')
})

test("zedScript starts with dolla sign", () => {
  const r = createRecord({$1: {"two @": {"three !": "test"}}})
  const f = r.getField(["$1", "two @", "three !"])

  expect(zedScript`${f}`).toBe('$1["two @"]["three !"]')
})

test("zedScript multiple spaces", () => {
  const r = createRecord({" my name is ted": "test"})
  const f = r.getField(" my name is ted")

  expect(zedScript`${f}`).toBe('this[" my name is ted"]')
})

test("zedScript correctly formats field name and parents path", () => {
  const r = createRecord({"captain's": {"\u33D2": "test"}})
  const f = r.getField(["captain's", "\u33D2"])

  expect(zedScript`${f}`).toBe('this["captain\'s"]["\u33D2"]')
})
