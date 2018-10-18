import initStore from "./store"

test("initStore runs", () => {
  const store = initStore()

  expect(store.hasOwnProperty("getState")).toBe(true)
  expect(store.hasOwnProperty("dispatch")).toBe(true)
  expect(store.hasOwnProperty("subscribe")).toBe(true)
})
