/**
 * @jest-environment jsdom
 */

import initTestStore from "src/test/unit/helpers/initTestStore"
import {encodeSessionState} from "../session-state"
import {WindowManager} from "./window-manager"

let store

beforeEach(async () => {
  store = await initTestStore()
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

test("does not serialize detail hidden or about window", async () => {
  const manager = new WindowManager()
  await manager.create("detail")
  await manager.create("hidden")
  await manager.create("about")
  expect(await manager.serialize()).toEqual([])
})

test("brings up a search window if none exists", async () => {
  const instance1 = new WindowManager()
  await instance1.create("detail")
  await instance1.create("hidden")
  await instance1.create("about")

  const state = await instance1.serialize()
  const session = encodeSessionState(state, null)
  const instance2 = new WindowManager(session)
  await instance2.init()
  expect(instance2.all.map((w) => w.name)).toEqual(["search", "hidden"])
})

test("does not brings up a search window if one exists", async () => {
  const instance1 = new WindowManager()
  await instance1.create("search")
  await instance1.create("search")

  const state = await instance1.serialize()
  const session = encodeSessionState(state, null)
  const instance2 = new WindowManager(session)
  await instance2.init()
  expect(instance2.all.map((w) => w.name)).toEqual([
    "search",
    "search",
    "hidden",
  ])
})
