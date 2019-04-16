/* @flow */

import {getBoomOptions} from "./boom"
import {setBoomdCredentials, useBoomCache, useBoomIndex} from "../state/actions/boomd"
import {setCurrentSpaceName} from "../state/actions/spaces"
import {setOuterTimeWindow} from "../state/actions/timeWindow"
import initTestStore from "../test/initTestStore"

test("#getBoomOptions", () => {
  const store = initTestStore()
  const state = store.dispatchAll([
    setBoomdCredentials({
      host: "boom.com",
      port: "123",
      user: "rosie",
      pass: "puppy"
    }),
    setOuterTimeWindow([new Date(0), new Date(1)]),
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
