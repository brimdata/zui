/* @flow */
import type {SpaceDetailPayload} from "../../services/zealot/types"
import Spaces from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

let detail: SpaceDetailPayload = {
  name: "default",
  min_time: {sec: 1425564900, ns: 0},
  max_time: {sec: 1428917793, ns: 750000000},
  packet_support: true
}

test("setting the names", () => {
  let state = store.dispatchAll([
    Spaces.setNames("cluster1", ["default", "hq_integration"])
  ])

  expect(Spaces.names("cluster1")(state)).toEqual(["default", "hq_integration"])
})

test("setting the space detail", () => {
  let state = store.dispatchAll([Spaces.setDetail("cluster1", detail)])

  expect(Spaces.get("cluster1", "default")(state)).toEqual(detail)
})

test("setting the ingest_progress", () => {
  store.dispatchAll([
    Spaces.setIngestProgress("cluster1", detail.name, 0.5),
    Spaces.setDetail("cluster1", detail)
  ])

  let value = Spaces.getIngestProgress(
    "cluster1",
    detail.name
  )(store.getState())

  expect(value).toEqual(0.5)
})
