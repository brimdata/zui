/* @flow */
import Spaces from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

let mock = {
  name: "default",
  min_time: {sec: 1425564900, ns: 0},
  max_time: {sec: 1428917793, ns: 750000000},
  packet_support: true
}

let update = {
  start_time: {sec: 1583434879, ns: 377382000},
  update_time: {sec: 1583434881, ns: 668859000},
  packet_total_size: 160083122,
  packet_read_size: 160083122
}

test("setting the names", () => {
  let state = store.dispatchAll([
    Spaces.setNames("cluster1", ["default", "hq_integration"])
  ])

  expect(Spaces.names("cluster1")(state)).toEqual(["default", "hq_integration"])
})

test("setting the space detail", () => {
  let state = store.dispatchAll([Spaces.setDetail("cluster1", mock)])

  expect(Spaces.get("cluster1", "default")(state)).toEqual(mock)
})

test("setting the packet post status", () => {
  store.dispatchAll([
    Spaces.setPacketPostStatus("cluster1", mock.name, update),
    Spaces.setDetail("cluster1", mock)
  ])

  let status = Spaces.getPacketPostStatus(
    "cluster1",
    mock.name
  )(store.getState())

  expect(status).toEqual({
    start_time: {sec: 1583434879, ns: 377382000},
    update_time: {sec: 1583434881, ns: 668859000},
    packet_total_size: 160083122,
    packet_read_size: 160083122
  })
})
