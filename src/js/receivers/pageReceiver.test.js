import pageReceiver from "./pageReceiver"

test("SearchEnd when received same as expected", () => {
  const dispatch = jest.fn()
  const receiver = pageReceiver(dispatch, 3)
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
  const receiver = pageReceiver(dispatch, 5)
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

test.skip("SearchEnd when received more than expected", () => {
  const dispatch = jest.fn()
  const receiver = pageReceiver(dispatch, 2)
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

const getActions = fn => {
  return fn.mock.calls.map(([action]) => action)
}

const findAction = (fn, type) => {
  return getActions(fn).find(a => a.type === type)
}
