import initTestStore from "../test/initTestStore"
import saveWindowState from "./saveWindowState"

test("does not mutate state", () => {
  const store = initTestStore()
  const prevState = {...store.getState()}

  store.dispatch(saveWindowState())

  expect(store.getState()).toEqual(prevState)
})
