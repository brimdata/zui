import * as actions from "../actions/mainSearch"
import reducer from "./mainSearch"

const initialState = {
  isFetching: false,
  events: [],
  query: {
    program: "path=conn",
    timeWindow: [new Date("2018-01-01"), new Date("2018-01-02")],
    ts: new Date("2018-04-21")
  },
  historyTree: {
    data: "__root__"
  },
  contextIndices: []
}

test("MAIN_SEARCH_REQUEST", () => {
  const state = reducer(
    {...initialState, events: ["hiii"]},
    {type: "MAIN_SEARCH_REQUEST"}
  )

  expect(state.isFetching).toBe(true)
  expect(state.events).toEqual([])
})

test("MAIN_SEARCH_EVENTS", () => {
  const prevState = {events: ["item1"]}
  const action = actions.mainSearchEvents(["item2"])
  const state = reducer({...initialState, ...prevState}, action)

  expect(state.events).toEqual(["item1", "item2"])
})
