/**
 * @jest-environment jsdom
 */

import initTestStore from "src/test/unit/helpers/initTestStore"
import LakeStatuses from "./"
import {Store} from "../types"
import dispatchAll from "src/test/unit/helpers/dispatchAll"

let store: Store
beforeEach(async () => {
  store = await initTestStore()
})

test("set/remove lake status", () => {
  expect(LakeStatuses.get("123")(store.getState())).toBeUndefined()

  let state = dispatchAll(store, [LakeStatuses.set("123", "connected")])

  expect(LakeStatuses.get("123")(state)).toBe("connected")

  state = dispatchAll(store, [LakeStatuses.remove("123")])
  expect(LakeStatuses.get("123")(state)).toBeUndefined()
})
