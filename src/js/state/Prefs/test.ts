import Prefs from "./"
import initTestStore from "../../../../test/unit/helpers/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("set the preferred time format", () => {
  const state = store.dispatchAll([Prefs.setTimeFormat("YYYY")])

  expect(Prefs.getTimeFormat(state)).toEqual("YYYY")
})

test("set the dataDir", () => {
  const testDir = "/my/own/data/dir"
  const state = store.dispatchAll([Prefs.setDataDir(testDir)])

  expect(Prefs.getDataDir(state)).toEqual(testDir)
})
