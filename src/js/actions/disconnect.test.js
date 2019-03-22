import {disconnect} from "./disconnect"
import initStore from "../test/initStore"

describe("#disconnect", () => {
  let store, actionTypes
  beforeEach(() => {
    store = initStore()
    store.dispatch(disconnect())
    actionTypes = store.getActions().map(a => a.type)
  })

  test("dispatches LOGS_CLEAR", () => {
    expect(actionTypes).toContain("LOGS_CLEAR")
  })

  test("dispatches ANALYSIS_CLEAR", () => {
    expect(actionTypes).toContain("ANALYSIS_CLEAR")
  })

  test("dispatches DESCRIPTORS_CLEAR", () => {
    expect(actionTypes).toContain("DESCRIPTORS_CLEAR")
  })

  test("dispatches SEARCH_BAR_CLEAR", () => {
    expect(actionTypes).toContain("SEARCH_BAR_CLEAR")
  })

  test("dispatches CORRELATIONS_CLEAR_ALL", () => {
    expect(actionTypes).toContain("CORRELATIONS_CLEAR_ALL")
  })

  test("dispatches SPACES_CLEAR", () => {
    expect(actionTypes).toContain("SPACES_CLEAR")
  })

  test("dispatches TIME_WINDOWS_CLEAR", () => {
    expect(actionTypes).toContain("TIME_WINDOWS_CLEAR")
  })

  test("dispatches FILTER_TREE_CLEAR", () => {
    expect(actionTypes).toContain("FILTER_TREE_CLEAR")
  })

  test("dispatches STARRED_LOGS_CLEAR", () => {
    expect(actionTypes).toContain("STARRED_LOGS_CLEAR")
  })

  test("dispatches SEARCH_HISTORY_CLEAR", () => {
    expect(actionTypes).toContain("SEARCH_HISTORY_CLEAR")
  })

  test("dispatches LOG_VIEWER_CLEAR", () => {
    expect(actionTypes).toContain("LOG_VIEWER_CLEAR")
  })

  test("dispatches COUNT_BY_TIME_CLEAR", () => {
    expect(actionTypes).toContain("COUNT_BY_TIME_CLEAR")
  })
})
