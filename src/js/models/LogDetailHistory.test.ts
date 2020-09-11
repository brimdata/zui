import History from "./LogDetailHistory"

test("saves to history entries", () => {
  const history = new History()

  history.save("james")
  history.save("kerr")

  expect(history.entries).toEqual(["james", "kerr"])
})

test("getCurrent", () => {
  const history = new History()

  history.save("james")
  history.save("kerr")

  expect(history.getCurrent()).toBe("kerr")
})

test("getPrev when there is one", () => {
  const history = new History(["james", "kerr"])

  expect(history.getPrev()).toBe("james")
})

test("getPrev when there is not one", () => {
  const history = new History(["kerr"])

  expect(history.getPrev()).toBe(null)
})

test("getPrev when there an empty array", () => {
  const history = new History()

  expect(history.getPrev()).toBe(null)
})

test("getNext when there an empty array", () => {
  const history = new History()

  expect(history.getNext()).toBe(null)
})

test("getNext with one item", () => {
  const history = new History(["james"])

  expect(history.getNext()).toBe(null)
})

test("getNext with one item going back and forth", () => {
  const history = new History(["james"])
  history.getPrev()
  expect(history.getNext()).toBe(null)
})

test("getNext after going back", () => {
  const history = new History(["james", "kerr"])
  history.goBack()
  expect(history.getNext()).toBe("kerr")
})

test("getPrev after going forward", () => {
  const history = new History(["james", "andrew", "kerr"])
  history.goBack()
  history.goBack()
  history.goForward()
  expect(history.getPrev()).toBe("james")
})

test("getMostRecent when empty", () => {
  const history = new History()

  expect(history.getMostRecent()).toBe(null)
})

test("getMostRecent when not empty", () => {
  const history = new History(["james"])

  expect(history.getMostRecent()).toBe("james")
})
