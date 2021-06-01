import Launches from "./index"
import initTestStore from "../../../../test/unit/helpers/initTestStore"

beforeAll(() => {
  jest.useFakeTimers("modern")
  jest.setSystemTime(new Date("20 Aug 2020 00:12:00 GMT").getTime())
})

afterAll(() => {
  jest.useRealTimers()
})

test("launches initial state", () => {
  const store = initTestStore()
  expect(Launches.all(store.getState())).toEqual({})
})

test("touch version", () => {
  const store = initTestStore()
  store.dispatch(Launches.touchVersion("v1.0.0"))
  expect(Launches.all(store.getState())).toEqual({
    "v1.0.0": "2020-08-20T00:12:00.000Z"
  })
})

test("first run of version", () => {
  const store = initTestStore()
  expect(Launches.firstRunOfVersion(store.getState(), "v0.2.0")).toBe(true)
  store.dispatch(Launches.touchVersion("v0.2.0"))
  expect(Launches.firstRunOfVersion(store.getState(), "v0.2.0")).toBe(false)
})
