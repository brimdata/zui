import {createRecord} from "src/test/shared/factories/zed-factory"
import zql from "./index"

test("zql when nested with identifiers", () => {
  const r = createRecord({one: {two: {three: "test"}}})
  const f = r.getField(["one", "two", "three"])

  expect(zql`${f}`).toBe("one.two.three")
})

test("zql with empty string name", () => {
  const r = createRecord({"": "test"})
  const f = r.getField("")

  expect(zql`${f}==${f.value}`).toBe('this[""]=="test"')
})

test("zql nested with dollar sign space", () => {
  const r = createRecord({one: {two: {"$ three": "test"}}})
  const f = r.getField(["one", "two", "$ three"])

  expect(zql`${f}`).toBe('one.two["$ three"]')
})

test("zql nested with underscores", () => {
  const r = createRecord({"_ 1": {two: {"$ 3": "test"}}})
  const f = r.getField(["_ 1", "two", "$ 3"])

  expect(zql`${f}`).toBe('this["_ 1"].two["$ 3"]')
})

test("zql starts with dolla sign", () => {
  const r = createRecord({$1: {"two @": {"three !": "test"}}})
  const f = r.getField(["$1", "two @", "three !"])

  expect(zql`${f}`).toBe('$1["two @"]["three !"]')
})

test("zql multiple spaces", () => {
  const r = createRecord({" my name is ted": "test"})
  const f = r.getField(" my name is ted")

  expect(zql`${f}`).toBe('this[" my name is ted"]')
})

test("zql correctly formats field name and parents path", () => {
  const r = createRecord({"captain's": {"\u33D2": "test"}})
  const f = r.getField(["captain's", "\u33D2"])

  expect(zql`${f}`).toBe('this["captain\'s"]["\u33D2"]')
})
