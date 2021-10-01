import {Field} from "../../../zealot/zed"
import {zed} from "../../../zealot"
import zql from "./index"

test("zql correctly formats field name and parents path", () => {
  const testField = new Field("", new zed.String("test"))
  expect(zql`${testField}==${testField.value}`).toBe('this[""]=="test"')

  testField.name = "three"
  testField.parents = ["one", "two"]
  expect(zql`${testField}`).toBe("one.two.three")

  testField.name = "$ three"
  expect(zql`${testField}`).toBe('one.two["$ three"]')

  testField.name = "$ 3"
  testField.parents = ["_ 1", "two"]
  expect(zql`${testField}`).toBe('this["_ 1"].two["$ 3"]')

  testField.name = "three !"
  testField.parents = ["$1", "two @"]
  expect(zql`${testField}`).toBe('$1["two @"]["three !"]')

  testField.name = " my name is ted"
  testField.parents = []
  expect(zql`${testField}`).toBe('this[" my name is ted"]')

  testField.name = "\u33D2"
  testField.parents = ["captain's"]
  expect(zql`${testField}`).toBe('this["captain\'s"]["\u33D2"]')
})
