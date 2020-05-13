/* @flow */
import Boomd from "./"
import Clusters from "../Clusters"
import Search from "../Search"
import Tab from "../Tab"
import initTestStore from "../../test/initTestStore"

test("setting use analytics cache", () => {
  const store = initTestStore()
  store.dispatch(Boomd.useCache(true))
  expect(Boomd.usingCache(store.getState())).toEqual(true)
  store.dispatch(Boomd.useCache(false))
  expect(Boomd.usingCache(store.getState())).toEqual(false)
})

test("setting use index", () => {
  const store = initTestStore()
  store.dispatch(Boomd.useIndex(true))
  expect(Boomd.usingIndex(store.getState())).toEqual(true)
  store.dispatch(Boomd.useIndex(false))
  expect(Boomd.usingIndex(store.getState())).toEqual(false)
})

test("#getBoomOptions", () => {
  const store = initTestStore()
  const state = store.dispatchAll([
    Clusters.add({
      id: "abc",
      host: "boom.com",
      port: "123",
      username: "rosie",
      password: "puppy"
    }),
    Search.setCluster("abc"),
    Search.setSpanArgsFromDates([new Date(0), new Date(1)]),
    Tab.computeSpan(),
    Search.setSpace("spaceId", "spaceName"),
    Boomd.useCache(true),
    Boomd.useIndex(false)
  ])

  expect(Boomd.getOptions(state)).toEqual(
    expect.objectContaining({
      adapter: "BrowserFetch",
      enableCache: true,
      enableIndex: false,
      username: "rosie",
      host: "boom.com",
      port: 123,
      password: "puppy",
      searchSpace: "spaceName",
      searchSpan: [
        new Date("1970-01-01T00:00:00.000Z"),
        new Date("1970-01-01T00:00:00.001Z")
      ]
    })
  )
})
