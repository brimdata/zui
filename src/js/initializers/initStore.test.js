import initStore from "./initStore"
import initTestStore from "../test/initStore"

test("initStore runs", () => {
  const store = initStore()

  expect(store.hasOwnProperty("getState")).toBe(true)
  expect(store.hasOwnProperty("dispatch")).toBe(true)
  expect(store.hasOwnProperty("subscribe")).toBe(true)
})

test("initTestStore works with thunk and action log", () => {
  const store = initTestStore({})

  store.dispatch({type: "A"})
  store.dispatch(dispatch => dispatch({type: "B"}))
  store.dispatch({type: "C"})

  expect(store.getActions().map(a => a.type)).toEqual(["A", "B", "C"])
})
