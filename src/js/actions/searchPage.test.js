import * as searchPage from "./searchPage"
import {setCurrentSpaceName} from "./spaces"
import initStore from "../test/initStore"
import * as spaces from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"
import MockApi from "../test/MockApi"
import {Handler} from "boom-js-client"

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

let spacesEndpoint
let spaceEndpoint
let store
beforeEach(() => {
  spacesEndpoint = new Handler()
  spaceEndpoint = new Handler()
  store = initStore(
    new MockApi({
      spaces: jest.fn(() => spacesEndpoint),
      space: jest.fn(() => spaceEndpoint)
    })
  )
})

test("init with several spaces", done => {
  store
    .dispatch(searchPage.init())
    .then(() => {
      expect(spaces.getCurrentSpaceName(store.getState())).toBe("default")
      expect(spaces.getCurrentSpace(store.getState())).toEqual(
        expect.objectContaining(defaultSpace)
      )
      expect(getTimeWindow(store.getState())).toEqual([
        new Date("2015-04-13T09:06:33.750Z"),
        new Date("2015-04-13T09:36:33.750Z")
      ])
      done()
    })
    .catch(e => done("failed with: " + e))

  spacesEndpoint.onDone(["default", "ranch-logs"])
  spaceEndpoint.onDone(defaultSpace)
})

test("init with no spaces", done => {
  store
    .dispatch(searchPage.init())
    .then(() => done("Expected to fail with NoSpaces"))
    .catch(e => {
      expect(e).toBe("NoSpaces")
      done()
    })

  spacesEndpoint.onDone([])
})

test("init with a space already selected", done => {
  store.dispatch(setCurrentSpaceName("alternate"))
  store
    .dispatch(searchPage.init())
    .then(() => {
      expect(spaces.getCurrentSpaceName(store.getState())).toBe("alternate")
      done()
    })
    .catch(e => done(e))

  spacesEndpoint.onDone([alternateSpace.name])
  spaceEndpoint.onDone(alternateSpace)
})
