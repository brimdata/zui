/* @flow */

import {getCurrentSpace, getCurrentSpaceName} from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"
import {initSearchPage} from "./searchPage"
import {setBoomdCredentials, setCurrentSpaceName} from "../actions"
import MockBoomClient from "../../test/MockBoomClient"
import initTestStore from "../../test/initTestStore"

const defaultSpace = {
  name: "default",
  min_time: {sec: 1425564900, ns: 0},
  max_time: {sec: 1428917793, ns: 750000000}
}

const alternateSpace = {
  name: "alternate",
  min_time: {sec: 1425564901, ns: 0},
  max_time: {sec: 1428917794, ns: 750000000}
}

test("init with several spaces", (done) => {
  const boom = new MockBoomClient()
  boom.stub("spaces.list", ["default", "ranch-logs"])
  boom.stub("spaces.get", defaultSpace)
  boom.stub("search", [])
  const store = initTestStore(boom)
  store.dispatch(
    setBoomdCredentials({host: "h", port: "1", user: "", pass: ""})
  )

  store
    .dispatch(initSearchPage())
    .then(() => {
      expect(getCurrentSpaceName(store.getState())).toBe("default")
      expect(getCurrentSpace(store.getState())).toEqual(
        expect.objectContaining(defaultSpace)
      )
      expect(getTimeWindow(store.getState())).toEqual([
        new Date("2015-04-13T09:06:33.750Z"),
        new Date("2015-04-13T09:36:33.750Z")
      ])
      done()
    })
    .catch((e) => done.fail("failed with: " + e))
})

test("init with no spaces", (done) => {
  const boom = new MockBoomClient()
  boom.stub("spaces.list", [])
  boom.stub("spaces.get", defaultSpace)
  boom.stub("search", [])
  const store = initTestStore(boom)
  store.dispatch(
    setBoomdCredentials({host: "h", port: "1", user: "", pass: ""})
  )

  store
    .dispatch(initSearchPage())
    .then(() => done.fail("Expected to fail with NoSpaces"))
    .catch((e) => {
      expect(e).toBe("NoSpaces")
      done()
    })
})

test("init with a space already selected", (done) => {
  const boom = new MockBoomClient()
  boom.stub("spaces.list", ["alternate"])
  boom.stub("spaces.get", alternateSpace)
  boom.stub("search", [])
  const store = initTestStore(boom)
  store.dispatch(
    setBoomdCredentials({host: "h", port: "1", user: "", pass: ""})
  )

  store.dispatch(setCurrentSpaceName("alternate"))
  store
    .dispatch(initSearchPage())
    .then(() => {
      expect(getCurrentSpaceName(store.getState())).toBe("alternate")
      done()
    })
    .catch((e) => done.fail(e))
})
