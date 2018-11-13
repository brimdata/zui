import * as searchPage from "./searchPage"
import {setCurrentSpaceName} from "./spaces"
import initStore from "../test/initStore"
import * as spaces from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"
import MockApi from "../test/MockApi"

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
  const api = new MockApi({
    spaces: () => ({done: cb => cb(["default", "ranch-logs"])}),
    space: () => ({done: cb => cb(defaultSpace)})
  })

  const store = initStore(api)
  store
    .dispatch(searchPage.init())
    .then(() => {
      expect(spaces.getCurrentSpaceName(store.getState())).toBe("default")
      expect(spaces.getCurrentSpace(store.getState())).toEqual(
        expect.objectContaining(defaultSpace)
      )
      expect(getTimeWindow(store.getState())).toEqual([
        new Date("2015-03-05T14:15:00.000Z"),
        new Date("2015-04-13T09:36:33.750Z")
      ])
      done()
    })
    .catch(e => done("failed with: " + e))
})

test("init with no spaces", done => {
  const api = new MockApi({
    spaces: () => ({done: cb => cb([])})
  })

  const store = initStore(api)
  store
    .dispatch(searchPage.init())
    .then(() => {
      done("Expected to fail with NoSpaces")
    })
    .catch(e => {
      expect(e).toBe("NoSpaces")
      done()
    })
})

test("init with a space already selected", done => {
  const api = new MockApi({
    spaces: jest.fn(() => ({done: cb => cb(["default", "alternate"])})),
    space: jest.fn(() => ({done: cb => cb(alternateSpace)}))
  })
  const store = initStore(api)
  store.dispatch(setCurrentSpaceName("alternate"))
  store
    .dispatch(searchPage.init())
    .then(() => {
      expect(api.spaces).toBeCalled()
      expect(api.space).toBeCalledWith({name: "alternate"})
      done()
    })
    .catch(e => done(e))
})
