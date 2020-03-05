/* @flow */
import Spaces from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("setting the names", () => {
  let state = store.dispatchAll([
    Spaces.setNames("cluster1", ["default", "hq_integration"])
  ])

  expect(Spaces.names("cluster1")(state)).toEqual(["default", "hq_integration"])
})

test("setting the space detail", () => {
  let mock = {
    name: "default",
    min_time: {sec: 1425564900, ns: 0},
    max_time: {sec: 1428917793, ns: 750000000},
    packet_support: true
  }
  let state = store.dispatchAll([Spaces.setDetail("cluster1", mock)])

  expect(Spaces.get("cluster1", "default")(state)).toEqual(mock)
})
