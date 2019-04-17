/* @flow */

import {errorPackets, receivePackets, requestPackets} from "../actions"
import {getDownloads} from "./packets"
import initTestStore from "../../test/initTestStore"

let store

beforeEach(() => {
  store = initTestStore()
})

const reduce = (actions) => store.dispatchAll(actions)

test("requesting packets", () => {
  const state = reduce([requestPackets("123")])

  expect(getDownloads(state)[0]).toEqual({
    uid: "123",
    percentComplete: 0,
    error: null
  })
})

test("receiving packets", () => {
  const uid = "123"
  const state = reduce([requestPackets(uid), receivePackets(uid, "123.pcap")])

  expect(getDownloads(state)[0]).toEqual({
    uid,
    percentComplete: 1,
    error: null
  })
})

test("error with the packets", () => {
  const uid = "123"
  const state = reduce([
    requestPackets(uid),
    errorPackets(uid, "boom goes the dyno")
  ])

  expect(getDownloads(state)[0]).toEqual({
    uid,
    percentComplete: 0.0,
    error: "boom goes the dyno"
  })
})
