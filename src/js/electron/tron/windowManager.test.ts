import initIpcListeners from "src/js/initializers/initIpcListeners"
import initTestStore from "test/unit/helpers/initTestStore"
import tron from "./index"

let store = initTestStore()
initIpcListeners(store, null)

beforeEach(() => {
  store = initTestStore()
})

test("serialize each window", async () => {
  const manager = tron.windowManager()
  manager.openWindow("search")
  const data = await manager.serialize()
  expect(data).toEqual([
    {
      id: expect.any(String),
      lastFocused: expect.any(Number),
      name: "search",
      position: [0, 0],
      size: [100, 100],
      state: expect.objectContaining({tabs: expect.any(Object)})
    }
  ])
})

test("confirm quit is true", async () => {
  const manager = tron.windowManager()
  manager.openWindow("search")
  const ok = await manager.confirmQuit()
  expect(ok).toBe(true)
})

test("when all closed resolves", (done) => {
  const manager = tron.windowManager()
  let pending = true
  manager.whenAllClosed().then(() => (pending = false))
  setTimeout(() => {
    expect(pending).toBe(false)
    done()
  })
})

test("when all closed waits until windows are done", (done) => {
  const manager = tron.windowManager()
  manager.openWindow("search")
  let pending = true
  manager.whenAllClosed().then(() => (pending = false))
  setTimeout(() => {
    expect(pending).toBe(true)
    done()
  })
})

test("prevent multiple hidden windows", async () => {
  const manager = tron.windowManager()
  manager.openHidden()
  let windows = manager.getWindows()
  expect(windows).toHaveLength(1)
  expect(windows[0].name).toEqual("hidden")

  // try again, still expect only 1
  manager.openHidden()
  windows = manager.getWindows()
  expect(windows).toHaveLength(1)
  expect(windows[0].name).toEqual("hidden")
})
