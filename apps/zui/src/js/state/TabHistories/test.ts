/**
 * @jest-environment jsdom
 */

import Histories from "src/app/core/models/histories"
import initTestStore from "src/test/unit/helpers/initTestStore"
import TabHistories from "./index"

let store
beforeEach(async () => {
  store = await initTestStore()
})

test("save and select", () => {
  const h = new Histories()
  h.create("1")
  h.create("2")
  h.create("3")

  store.dispatch(TabHistories.save(h.serialize()))

  expect(TabHistories.selectAll(store.getState())).toEqual([
    {
      id: "1",
      entries: ["/"],
      index: 0,
    },
    {
      id: "2",
      entries: ["/"],
      index: 0,
    },
    {
      id: "3",
      entries: ["/"],
      index: 0,
    },
  ])
})
