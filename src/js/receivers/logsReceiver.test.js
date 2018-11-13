/* @flow */

import logsReceiver from "./logsReceiver"

test("SearchResult", () => {
  const dispatch = jest.fn()
  const receiver = logsReceiver(dispatch)
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

const actionTypes = mockFn => {
  return mockFn.mock.calls.map(([action]) => action.type)
}
