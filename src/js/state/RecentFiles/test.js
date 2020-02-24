/* @flow */
import RecentFiles from "./"
import createGlobalStore from "../createGlobalStore"

let store

beforeEach(() => {
  store = createGlobalStore()
})

const select = (s) => s(store.getState())
const dispatch = (a) => store.dispatch(a)

test("open", () => {
  dispatch(RecentFiles.open("~/file-path"))

  expect(select(RecentFiles.getPaths)).toEqual(["~/file-path"])
})

test("remove", () => {
  dispatch(RecentFiles.open("~/file-path"))
  dispatch(RecentFiles.remove("~/file-path"))

  expect(select(RecentFiles.getPaths)).toEqual([])
})

test("get paths is sorted by last opened", () => {
  dispatch(RecentFiles.open("1", 1))
  dispatch(RecentFiles.open("2", 2))
  dispatch(RecentFiles.open("3", 3))
  dispatch(RecentFiles.open("4", 4))
  dispatch(RecentFiles.open("1", 5))
  expect(select(RecentFiles.getPaths)).toEqual(["1", "4", "3", "2"])
})
