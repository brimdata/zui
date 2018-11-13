/* @flow */

import logsReceiver from "./logsReceiver"

test("SearchResult", () => {
  const dispatch = jest.fn()
  const receiver = logsReceiver(dispatch, 3)
  const payload = {
    type: "SearchResult",
    results: {
      tuples: [["a"], ["b"], ["c"]],
      descriptor: [{type: "string", name: "letter"}]
    }
  }
  receiver(payload)
  expect(dispatch.mock.calls.length).toBe(2)
  expect(actionTypes(dispatch)).toContain("MAIN_SEARCH_EVENTS")
})

test("SearchEnd when received same as expected", () => {
  const dispatch = jest.fn()
  const receiver = logsReceiver(dispatch, 3)
  receiver({
    type: "SearchResult",
    results: {
      tuples: [["a"], ["b"], ["c"]],
      descriptor: [{type: "string", name: "letter"}]
    }
  })
  receiver({
    type: "SearchEnd"
  })
  const action = findAction(dispatch, "LOG_VIEWER_MORE_AHEAD_SET")
  expect(action).toHaveProperty("value", true)
})

test("SearchEnd when received less than expected", () => {
  const dispatch = jest.fn()
  const receiver = logsReceiver(dispatch, 5)
  receiver({
    type: "SearchResult",
    results: {
      tuples: [["a"], ["b"], ["c"]],
      descriptor: [{type: "string", name: "letter"}]
    }
  })
  receiver({
    type: "SearchEnd"
  })
  const action = findAction(dispatch, "LOG_VIEWER_MORE_AHEAD_SET")
  expect(action).toHaveProperty("value", false)
})

test("SearchEnd when received more than expected", () => {
  const dispatch = jest.fn()
  const receiver = logsReceiver(dispatch, 2)
  receiver({
    type: "SearchResult",
    results: {
      tuples: [["a"]],
      descriptor: [{type: "string", name: "letter"}]
    }
  })
  receiver({
    type: "SearchResult",
    results: {
      tuples: [["b"]],
      descriptor: [{type: "string", name: "letter"}]
    }
  })
  receiver({
    type: "SearchResult",
    results: {
      tuples: [["c"]],
      descriptor: [{type: "string", name: "letter"}]
    }
  })
  receiver({
    type: "SearchEnd"
  })
  const action = findAction(dispatch, "LOG_VIEWER_MORE_AHEAD_SET")
  expect(action).toHaveProperty("value", true)
})

const actionTypes = fn => {
  return getActions(fn).map(a => a.type)
}

const getActions = fn => {
  return fn.mock.calls.map(([action]) => action)
}

const findAction = (fn, type) => {
  return getActions(fn).find(a => a.type === type)
}
