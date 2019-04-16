/* @flow */

import * as packets from "./packets"
import * as a from "../actions/packets"

const reduce = (actions) => ({
  packets: actions.reduce(packets.default, packets.initialState)
})

test("requesting packets", () => {
  const state = reduce([a.requestPackets("123")])

  expect(packets.getDownloads(state)[0]).toEqual({
    uid: "123",
    percentComplete: 0,
    error: null
  })
})

test("receiving packets", () => {
  const uid = "123"
  const state = reduce([
    a.requestPackets(uid),
    a.receivePackets(uid, "123.pcap")
  ])

  expect(packets.getDownloads(state)[0]).toEqual({
    uid,
    percentComplete: 1,
    error: null
  })
})

test("error with the packets", () => {
  const uid = "123"
  const state = reduce([
    a.requestPackets(uid),
    a.errorPackets(uid, "boom goes the dyno")
  ])

  expect(packets.getDownloads(state)[0]).toEqual({
    uid,
    percentComplete: 0.0,
    error: "boom goes the dyno"
  })
})
