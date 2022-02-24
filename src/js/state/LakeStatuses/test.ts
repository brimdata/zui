import initTestStore from "src/test/unit/helpers/initTestStore"
import LakeStatuses from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("set/remove lake status", () => {
  expect(LakeStatuses.get("123")(store.getState())).toBeUndefined()

  let state = store.dispatchAll([LakeStatuses.set("123", "connected")])

  expect(LakeStatuses.get("123")(state)).toBe("connected")

  state = store.dispatchAll([LakeStatuses.remove("123")])
  expect(LakeStatuses.get("123")(state)).toBeUndefined()
})
