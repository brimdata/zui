/**
 * @jest-environment jsdom
 */

import initIpcListeners from "src/js/initializers/initIpcListeners"
import initTestStore from "src/test/unit/helpers/initTestStore"
import {WindowManager} from "./window-manager"

let store = initTestStore()
initIpcListeners(store, null)

beforeEach(() => {
  store = initTestStore()
})

test("serialize each window", async () => {
  const manager = new WindowManager()
  const win = await manager.create("search")
  manager.update(win.id, store.getState())
  const data = await manager.serialize()
  expect(data).toEqual([
    {
      id: expect.any(String),
      lastFocused: expect.any(Number),
      name: "search",
      position: [0, 0],
      size: [100, 100],
      state: expect.objectContaining({tabs: expect.any(Object)}),
    },
  ])
})
