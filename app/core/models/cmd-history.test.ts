import CmdHistory from "./cmd-history"

let h: CmdHistory
beforeEach(() => {
  h = new CmdHistory([], 0, 5)
})

test("push", () => {
  h.push("a")

  expect(h.all()).toEqual(["a"])
})

test("back", () => {
  h.push("a")
  h.push("b")

  expect(h.back()).toEqual("a")
  expect(h.all()).toEqual(["a", "b"])
})

test("fowrard", () => {
  h.push("a")
  h.push("b")
  h.push("c")
  h.back()
  h.back()

  expect(h.forward()).toEqual("b")
  expect(h.all()).toEqual(["a", "b", "c"])
})

test("back when none", () => {
  expect(h.back()).toEqual(null)
  expect(h.all()).toEqual([])
})

test("forward when none", () => {
  expect(h.forward()).toEqual(null)
  expect(h.all()).toEqual([])
})

test("limit", () => {
  h.push("a")
  h.push("b")
  h.push("c")
  h.push("d")
  h.push("e")
  // This one is over the limit
  h.push("f")
  expect(h.all()).toEqual(["b", "c", "d", "e", "f"])
})
