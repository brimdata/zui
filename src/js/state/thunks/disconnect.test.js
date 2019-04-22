/* @flow */
import {disconnect} from "./disconnect"
import initTestStore from "../../test/initTestStore"

describe("#disconnect", () => {
  let store, actionTypes
  beforeEach(() => {
    store = initTestStore()
    store.dispatch(disconnect())
    actionTypes = store.getActions().map((a) => a.type)
  })

  test("dispatches SEARCH_BAR_CLEAR", () => {
    expect(actionTypes).toContain("SEARCH_BAR_CLEAR")
  })

  test("dispatches SPACES_CLEAR", () => {
    expect(actionTypes).toContain("SPACES_CLEAR")
  })

  test("dispatches TIME_WINDOWS_CLEAR", () => {
    expect(actionTypes).toContain("TIME_WINDOWS_CLEAR")
  })

  test("dispatches STARRED_LOGS_CLEAR", () => {
    expect(actionTypes).toContain("STARRED_LOGS_CLEAR")
  })

  test("dispatches SEARCH_HISTORY_CLEAR", () => {
    expect(actionTypes).toContain("SEARCH_HISTORY_CLEAR")
  })
})
