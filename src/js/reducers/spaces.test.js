import initStore from "../test/initStore"
import reducer, {initialState, getSpaces, getAllSpaceNames} from "./spaces"
import * as a from "../actions/spaces"

const reduce = actions => ({spaces: actions.reduce(reducer, initialState)})

test("setting space information", () => {
  const spaceInfo = {
    name: "ranch-logs",
    flush_timeout: 500,
    close_timeout: 5000,
    slab_threshold: 131072,
    slab_fanout: 8,
    max_writers: 150,
    min_time: {
      sec: 1425564900,
      ns: 0
    },
    max_time: {
      sec: 1428917793,
      ns: 750000000
    },
    size: 199913776
  }

  const state = reduce([a.setSpaceInfo(spaceInfo)])

  expect(getSpaces(state)).toEqual({
    "ranch-logs": {
      name: "ranch-logs",
      flush_timeout: 500,
      close_timeout: 5000,
      slab_threshold: 131072,
      slab_fanout: 8,
      max_writers: 150,
      minTime: new Date(Date.UTC(2015, 2, 5, 14, 15, 0, 0)),
      maxTime: new Date(Date.UTC(2015, 3, 13, 9, 36, 33, 750)),
      min_time: {
        sec: 1425564900,
        ns: 0
      },
      max_time: {
        sec: 1428917793,
        ns: 750000000
      },
      size: 199913776
    }
  })
})

test("setting space names", () => {
  const store = initStore()
  store.dispatch(a.setSpaceNames(["a", "b", "c"]))

  expect(getAllSpaceNames(store.getState())).toEqual(["a", "b", "c"])
})
