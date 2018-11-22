/* @flow */

import columnsReceiver from "./columnsReceiver"
import initStore from "../test/initStore"
import * as spaces from "../actions/spaces"
import * as descriptors from "../actions/descriptors"
import {Handler} from "boom-js-client"

const td_1 = [{type: "string", name: "_td"}, {type: "integer", name: "one"}]
const td_2 = [{type: "string", name: "_td"}, {type: "integer", name: "two"}]

const allSamePayload = {
  type: "SearchResult",
  results: {
    tuples: [["1"], ["1"], ["1"]]
  }
}

const mixedPayload = {
  type: "SearchResult",
  results: {
    tuples: [["2"], ["3"], ["4"]]
  }
}

let store
beforeEach(() => {
  const handler = new Handler()
  const api = {
    descriptor: () => handler
  }
  store = initStore(api)
  store.dispatchAll([
    spaces.setCurrentSpaceName("default"),
    descriptors.receiveDescriptor("default", "1", td_1)
  ])
})

test("sets columns after first payload", () => {
  const receiver = columnsReceiver(store.dispatch, store.getState())
  receiver(allSamePayload)

  expect(store.getActions()).toEqual([{columns: td_1, type: "COLUMNS_SET"}])
})

test("only sets columns once", () => {
  const receiver = columnsReceiver(store.dispatch, store.getState())
  receiver(allSamePayload)
  receiver(allSamePayload)
  receiver(allSamePayload)

  expect(store.getActions().length).toBe(1)
})

test("sets columns to empty when mixed payload", () => {
  const receiver = columnsReceiver(store.dispatch, store.getState())
  receiver(mixedPayload)

  expect(store.getActions()).toEqual([{columns: [], type: "COLUMNS_SET"}])
})

test("only sets columns once when mixed", () => {
  const receiver = columnsReceiver(store.dispatch, store.getState())
  receiver(mixedPayload)
  receiver(mixedPayload)
  receiver(mixedPayload)

  expect(store.getActions()).toEqual([{columns: [], type: "COLUMNS_SET"}])
})

test("sets columns when same, unsets when mixed", () => {
  const receiver = columnsReceiver(store.dispatch, store.getState())
  receiver(allSamePayload)

  receiver(mixedPayload)
  expect(store.getActions()).toEqual([
    {columns: td_1, type: "COLUMNS_SET"},
    {columns: [], type: "COLUMNS_SET"}
  ])
})

test("fetches descriptor if not in cache", () => {
  const handler = new Handler()
  const api = {descriptor: jest.fn(() => handler)}
  const store = initStore(api)
  const receiver = columnsReceiver(store.dispatch, store.getState())

  store.dispatchAll([spaces.setCurrentSpaceName("default")])
  const payload = {type: "SearchResult", results: {tuples: [["2"], ["2"]]}}
  receiver(payload)

  expect(store.getActions()).toEqual([
    {id: "2", space: "default", type: "DESCRIPTOR_REQUEST"}
  ])

  store.clearActions()
  handler.onDone(td_2)

  expect(store.getActions()).toEqual([
    {
      descriptor: td_2,
      id: "2",
      space: "default",
      type: "DESCRIPTOR_RECEIVE"
    },
    {
      columns: td_2,
      type: "COLUMNS_SET"
    }
  ])
})

test("sets to empty columns if while fetching another td is detected", () => {
  const handler = new Handler()
  const api = {descriptor: jest.fn(() => handler)}
  const store = initStore(api)
  const receiver = columnsReceiver(store.dispatch, store.getState())

  store.dispatchAll([spaces.setCurrentSpaceName("default")])
  receiver(allSamePayload)
  receiver(mixedPayload)
  handler.onDone(td_1)

  receiver(allSamePayload)
  receiver(mixedPayload)

  expect(store.getActions()).toEqual([
    {id: "1", space: "default", type: "DESCRIPTOR_REQUEST"},
    {columns: [], type: "COLUMNS_SET"},
    {
      descriptor: td_1,
      id: "1",
      space: "default",
      type: "DESCRIPTOR_RECEIVE"
    }
  ])
})
