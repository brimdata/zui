import InputHistory from "./InputHistory"

test("push new value", () => {
  const history = new InputHistory()

  history.push("a")

  expect(history.getEntries()).toEqual(["a"])
})

test("getCurrentEntry gets latest entry", () => {
  const history = new InputHistory()

  history.push("a")
  history.push("b")
  history.push("c")

  expect(history.getCurrentEntry()).toEqual("c")
})

test("going back", () => {
  const history = new InputHistory()

  history.push("a")
  history.push("b")
  history.push("c")

  history.goBack()

  expect(history.getCurrentEntry()).toEqual("b")
})

test("going back twice", () => {
  const history = new InputHistory()

  history.push("a")
  history.push("b")
  history.push("c")

  history.goBack()
  history.goBack()

  expect(history.getCurrentEntry()).toEqual("a")
})

test("going back twice then forward twice", () => {
  const history = new InputHistory()

  history.push("a")
  history.push("b")
  history.push("c")

  history.goBack()
  history.goBack()
  history.goForward()
  history.goForward()

  expect(history.getCurrentEntry()).toEqual("c")
})

test("when going back too far", () => {
  const history = new InputHistory()

  history.push("a")
  history.push("b")
  history.push("c")

  history.goBack()
  history.goBack()
  history.goBack()

  expect(history.getCurrentEntry()).toEqual("a")
})

test("when going forward too far and then back", () => {
  const history = new InputHistory()

  history.push("a")
  history.push("b")
  history.push("c")

  history.goForward()

  expect(history.getCurrentEntry()).toEqual("c")

  history.goBack()

  expect(history.getCurrentEntry()).toEqual("b")
})

test("pushing duplicates", () => {
  const history = new InputHistory()

  history.push("a")
  history.push("b")
  history.push("b")
  history.push("b")

  expect(history.getEntries()).toEqual(["a", "b"])
})

test("pushing duplicates after going back", () => {
  const history = new InputHistory()

  history.push("a")
  history.push("b")
  history.goBack()
  history.push("b")

  expect(history.getEntries()).toEqual(["a", "b"])
})
