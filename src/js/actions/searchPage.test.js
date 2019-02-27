import {MockBoomClient} from "../test/MockApi"
import {getTimeWindow} from "../reducers/timeWindow"
import {setCurrentSpaceName} from "./spaces"
import initStore from "../test/initStore"
import * as searchPage from "./searchPage"
import * as spaces from "../reducers/spaces"

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

test("init with several spaces", done => {
  const boom = new MockBoomClient()
  boom.stubPromise("spaces.list", ["default", "ranch-logs"])
  boom.stubPromise("spaces.get", defaultSpace)
  boom.stubStream("search", [])
  const store = initStore(boom)

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
})

test("init with no spaces", done => {
  const boom = new MockBoomClient()
  boom.stubPromise("spaces.list", [])
  boom.stubPromise("spaces.get", defaultSpace)
  boom.stubStream("search", [])
  const store = initStore(boom)

  store
    .dispatch(searchPage.init())
    .then(() => done("Expected to fail with NoSpaces"))
    .catch(e => {
      expect(e).toBe("NoSpaces")
      done()
    })
})

test("init with a space already selected", done => {
  const boom = new MockBoomClient()
  boom.stubPromise("spaces.list", ["alternate"])
  boom.stubPromise("spaces.get", alternateSpace)
  boom.stubStream("search", [])
  const store = initStore(boom)

  store.dispatch(setCurrentSpaceName("alternate"))
  store
    .dispatch(searchPage.init())
    .then(() => {
      expect(spaces.getCurrentSpaceName(store.getState())).toBe("alternate")
      done()
    })
    .catch(e => done(e))
})
