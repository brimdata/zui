/* @flow */
import Tab from "../state/Tab"
import initTestStore from "../test/initTestStore"
import openPacket from "./openPacket"
import MockBoomClient from "../test/MockBoomClient"
import {applyMiddleware, compose, createStore} from "redux"
import rootReducer from "../state/rootReducer"
import reduxThunk from "redux-thunk"
import type {Action, State} from "../state/types"
import globalReducer from "../state/globalReducer"

let mockClient = {
  spaces: {
    create: () => Promise.resolve({name: "dataSpace"}),
    list: () => Promise.resolve(["dataSpace"]),
    get: () =>
      Promise.resolve({
        name: "dataSpace",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        packet_support: true
      })
  },
  pcaps: {
    post: function*() {
      yield {type: "TaskStart"}
      yield {
        type: "PacketPostStatus",
        start_time: {sec: 0, ns: 0},
        update_time: {sec: 1, ns: 1},
        packet_total_size: 100,
        packet_read_size: 1
      }
      yield {type: "TaskEnd"}
    }
  }
}

function applyDispatchAll() {
  return (createStore) => (...args) => {
    const store = createStore(...args)

    const dispatchAll = (actions: Action[]): State => {
      actions.forEach(store.dispatch)
      return store.getState()
    }

    return {
      ...store,
      dispatchAll
    }
  }
}

function applyActionHistory() {
  let actions = []
  return (createStore) => (...args) => {
    const store = createStore(...args)

    const dispatch = (...args) => {
      actions.push(args[0])
      return store.dispatch(...args)
    }

    const getActions = () => {
      return actions
    }

    const clearActions = () => {
      actions = []
    }

    return {
      ...store,
      dispatch,
      getActions,
      clearActions
    }
  }
}

test("opening a packet", async () => {
  let store = initTestStore()
  await store.dispatch(openPacket("~/Desktop/packet.pcap", mockClient))

  let state = store.getState()
  expect(Tab.spaceName(state)).toEqual("dataSpace")
  expect(Tab.space(state)).toEqual({
    name: "dataSpace",
    min_time: {ns: 0, sec: 0},
    max_time: {ns: 1, sec: 1},
    packet_support: true,
    ingest_progress: null
  })
})
