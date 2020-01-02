/* @flow */
import Spaces from "./"
import initTestStore from "../../test/initTestStore"
import mockSpace from "../../test/mockSpace"

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
  let mock = mockSpace()
  let state = store.dispatchAll([Spaces.setDetail("cluster1", mock)])

  expect(Spaces.get("cluster1", "default")(state)).toEqual(mock)
})
