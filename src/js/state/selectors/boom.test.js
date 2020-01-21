/* @flow */

import {getBoomOptions} from "./boom"
import Boomd from "../Boomd"
import Clusters from "../Clusters"
import Search from "../Search"
import Tab from "../Tab"
import initTestStore from "../../test/initTestStore"

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
    Search.setSpace("work-zone"),
    Boomd.useCache(true),
    Boomd.useIndex(false)
  ])

  expect(getBoomOptions(state)).toEqual(
    expect.objectContaining({
      adapter: "BrowserFetch",
      enableCache: true,
      enableIndex: false,
      username: "rosie",
      host: "boom.com",
      port: 123,
      password: "puppy",
      searchSpace: "work-zone",
      searchSpan: [
        new Date("1970-01-01T00:00:00.000Z"),
        new Date("1970-01-01T00:00:00.001Z")
      ]
    })
  )
})
