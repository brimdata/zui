/* @flow */
import {
  clearAllCorrelations,
  clearCorrelations,
  setCorrelation
} from "../state/actions"
import {conn} from "../test/mockLogs"
import {getCorrelations} from "../state/reducers/correlations"
import initTestStore from "../test/initTestStore"

const store = initTestStore()
const hash = conn()
const uid = []
const get = (key) => getCorrelations(store.getState())[key]

test("setting a correlation", () => {
  store.dispatch(setCorrelation("123-456", "hash", hash))

  expect(get("123-456")).toEqual({hash})
})

test("setting multiple", () => {
  store.dispatchAll([
    setCorrelation("123", "hash", hash),
    setCorrelation("123", "uid", uid)
  ])

  expect(get("123")).toEqual({
    hash: expect.any(Object),
    uid: expect.any(Object)
  })
})

test("clearing one correlation", () => {
  store.dispatchAll([
    setCorrelation("123", "hash", hash),
    setCorrelation("345", "uid", uid),
    clearCorrelations("123")
  ])

  expect(get("123")).toBeUndefined()
})

test("clearing all correlations", () => {
  const state = store.dispatchAll([
    setCorrelation("123", "hash", hash),
    setCorrelation("123", "uid", uid),
    clearAllCorrelations()
  ])

  expect(getCorrelations(state)).toEqual({})
})
