/**
 * @jest-environment jsdom
 */

import Tabs from "../../Tabs"
import Viewer from ".."
import initTestStore from "src/test/unit/helpers/initTestStore"
import Results from "../../Results"

let store

const dispatch = (...args) => store.dispatch(...args)
const select = (selector): any => selector(store.getState())
const indices = () => select(Viewer.getSelection).getIndices()
const values = Array(20).fill([{name: "a", type: "b", value: "c"}])

beforeEach(() => {
  store = initTestStore()
  const tabId = select(Tabs.getActive)
  const id = "test-selection"
  store.dispatch(Results.setValues({tabId, id, values}))
})

test("select one row", () => {
  dispatch(Viewer.select(0))

  expect(indices()).toEqual([0])
})

test("select one row, then another", () => {
  dispatch(Viewer.select(0))
  dispatch(Viewer.select(3))

  expect(indices()).toEqual([3])
})
