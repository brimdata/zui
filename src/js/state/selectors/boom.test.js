/* @flow */

import {getBoomOptions} from "./boom"
import {setCurrentSpaceName, useBoomCache, useBoomIndex} from "../actions"
import Clusters from "../Clusters"
import Search from "../Search"
import initTestStore from "../../test/initTestStore"
import tab from "../tab"

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
    tab.computeSpan(),
    setCurrentSpaceName("work-zone"),
    useBoomCache(true),
    useBoomIndex(false)
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
