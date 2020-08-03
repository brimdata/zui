/* @flow */

import Viewer from ".."
import initTestStore from "../../../test/initTestStore"

let store

beforeEach(() => {
  store = initTestStore()
})

const dispatch = (...args) => store.dispatch(...args)
const select = (selector) => selector(store.getState())

test("select one row", () => {
  dispatch(Viewer.select(0))
  const s = select(Viewer.getSelection)
  expect(s.includes(0)).toBe(true)
})

test("select one row, then another", () => {
  dispatch(Viewer.select(0))
  dispatch(Viewer.select(3))
  const s = select(Viewer.getSelection)
  expect(s.includes(0)).toBe(false)
  expect(s.includes(3)).toBe(true)
})

test("select multi one", () => {
  dispatch(Viewer.selectMulti(0))
  const s = select(Viewer.getSelection)

  expect(s.includes(0)).toBe(true)
  expect(s.includes(1)).toBe(false)
})

test("select multi more than one", () => {
  dispatch(Viewer.selectMulti(0))
  dispatch(Viewer.selectMulti(5))
  dispatch(Viewer.selectMulti(10))

  const s = select(Viewer.getSelection)

  expect(s.includes(0)).toBe(true)
  expect(s.includes(5)).toBe(true)
  expect(s.includes(10)).toBe(true)

  expect(s.includes(1)).toBe(false)
})

test("select range when no selection", () => {
  dispatch(Viewer.selectRange(2))

  const s = select(Viewer.getSelection)
  const selections = [true, true, true]

  selections.map((selected, index) => {
    expect(s.includes(index)).toBe(selected)
  })
})

test("select when there is a range going backwards", () => {
  dispatch(Viewer.select(5))
  dispatch(Viewer.selectRange(3))

  const s = select(Viewer.getSelection)
  const selections = [false, false, false, true, true, true]

  selections.map((selected, index) => {
    expect(s.includes(index)).toBe(selected)
  })
})

test("select range when you've selected a few already", () => {
  dispatch(Viewer.select(0))
  dispatch(Viewer.selectMulti(2))
  dispatch(Viewer.selectRange(5))

  const s = select(Viewer.getSelection)
  const selections = [true, false, true, true, true, true]

  selections.map((selected, index) => {
    expect(s.includes(index)).toBe(selected)
  })
})

test("selecting a range forward, then backward", () => {
  dispatch(Viewer.selectMulti(3))
  dispatch(Viewer.selectRange(5))
  dispatch(Viewer.selectRange(0))

  const s = select(Viewer.getSelection)
  const selections = [true, true, true, true, false, false]

  selections.map((selected, index) => {
    expect(s.includes(index)).toBe(selected)
  })
})
