import History from "./history"

let history: History<string>
beforeEach(() => {
  history = new History<string>()
})

test("push new value", () => {
  history.push("a")

  expect(history.entries()).toEqual(["a"])
})

test("pushing the same value twice", () => {
  history.push("a")
  history.push("a")
  expect(history.entries()).toEqual(["a"])
})

test("pushing the same value twice after going back", () => {
  history.push("a")
  history.push("b")
  history.back()
  history.push("a")
  history.push("a")
  expect(history.entries()).toEqual(["a", "b"])
})

test("replace", () => {
  history.push("a")
  history.push("b")
  history.back()
  history.replace("z")
  expect(history.entries()).toEqual(["z", "b"])
})

test("update on object", () => {
  type Person = {name: string; age: number}
  const history = new History<Person>()
  history.push({name: "A", age: 1})
  history.push({name: "B", age: 2})
  history.push({name: "C", age: 3})
  history.update({name: "Z"})
  expect(history.current()).toEqual({name: "Z", age: 3})
})

test("push, push, back, push, back", () => {
  history.push("a")
  history.push("b")
  history.back()
  history.push("c")
  history.back()

  expect(history.current()).toEqual("a")
})

test("current gets latest entry", () => {
  history.push("a")
  history.push("b")
  history.push("c")

  expect(history.current()).toEqual("c")
})

test("going back", () => {
  history.push("a")
  history.push("b")
  history.push("c")

  history.back()

  expect(history.current()).toEqual("b")
})

test("going back twice", () => {
  history.push("a")
  history.push("b")
  history.push("c")

  history.back()
  history.back()

  expect(history.current()).toEqual("a")
})

test("going back twice then forward twice", () => {
  history.push("a")
  history.push("b")
  history.push("c")

  history.back()
  history.back()
  history.forward()
  history.forward()

  expect(history.current()).toEqual("c")
})

test("when going back too far", () => {
  history.push("a")
  history.push("b")
  history.push("c")

  history.back()
  history.back()
  history.back()

  expect(history.current()).toEqual("a")
})

test("when going forward too far and then back", () => {
  history.push("a")
  history.push("b")
  history.push("c")

  history.forward()

  expect(history.current()).toEqual("c")

  history.back()

  expect(history.current()).toEqual("b")
})

test("pushing duplicates", () => {
  history.push("a")
  history.push("b")
  history.push("b")
  history.push("b")

  expect(history.entries()).toEqual(["a", "b"])
})

test("pushing duplicates after going back", () => {
  history.push("a")
  history.push("b")
  history.back()
  history.push("b")

  expect(history.entries()).toEqual(["a", "b"])
})
