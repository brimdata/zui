/* @flow */

import NavHistory from "./NavHistory"

let history
beforeEach(() => {
  history = new NavHistory<string>({entries: []})
})

test("#constructor throws error if position is out of bounds", () => {
  expect(() => {
    new NavHistory<string>({entries: ["a"], position: 999})
  }).toThrow("Position out of bounds")
})

test("#push", () => {
  history.push("a")
  history.push("b")
  expect(history.getEntries()).toEqual(["a", "b"])
})

test("#push checks for equality of the currentEntry", () => {
  history.push("a")
  history.push("a")
  expect(history.getEntries()).toEqual(["a"])
})

test("#goBack", () => {
  history.push("a")
  history.push("b")
  history.goBack()
  expect(history.getCurrentEntry()).toBe("a")
})

test("#goForward", () => {
  history.push("a")
  history.push("b")
  history.goBack()
  history.goForward()
  expect(history.getCurrentEntry()).toBe("b")
})

test("#canGoBack when empty", () => {
  expect(history.canGoBack()).toBe(false)
})

test("#canGoBack when one item", () => {
  history.push("a")
  expect(history.canGoBack()).toBe(false)
})

test("#canGoBack when two", () => {
  history.push("a")
  history.push("b")
  expect(history.canGoBack()).toBe(true)
})

test("#canGoBack when backing up all the way", () => {
  history.push("a")
  history.push("b")
  history.goBack()
  expect(history.canGoBack()).toBe(false)
})

test("#canGoForward when empty", () => {
  expect(history.canGoForward()).toBe(false)
})

test("#canGoForward when one", () => {
  history.push("a")
  expect(history.canGoForward()).toBe(false)
})

test("#canGoForward when two", () => {
  history.push("a")
  history.push("b")
  expect(history.canGoForward()).toBe(false)
})

test("#canGoForward when two then back", () => {
  history.push("a")
  history.push("b")
  history.goBack()
  expect(history.canGoForward()).toBe(true)
})

test("#push after going back", () => {
  history.push("a")
  history.push("b")
  history.push("c")
  history.goBack()
  history.push("d")
  expect(history.getEntries()).toEqual(["a", "b", "d"])
  expect(history.getCurrentEntry()).toEqual("d")
})

test("#goBack can be called many times", () => {
  history.push("a")
  history.goBack()
  history.goBack()
  history.goBack()
  history.goBack()
  history.goBack()
  expect(history.getCurrentEntry()).toBe("a")
})

test("#goForward can be called many times", () => {
  history.push("a")
  history.goForward()
  history.goForward()
  history.goForward()
  history.goForward()
  history.goForward()
  expect(history.getCurrentEntry()).toBe("a")
})
