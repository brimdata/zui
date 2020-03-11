/* @flow */
import brim from "./"

let space = {
  name: "myspace",
  min_time: {sec: 1425565512, ns: 943615000},
  max_time: {sec: 1428917684, ns: 732650001},
  packet_support: true,
  ingest_progress: null,
  is_queryable: true
}

test("default time span is 30 mins before max time", () => {
  let span = brim.space(space).defaultSpanArgs()
  expect(span).toEqual([
    {sec: 1428915885, ns: 0},
    {sec: 1428917685, ns: 0}
  ])
})

test("default time span is last 30 minutes if data is recent", () => {
  let recent = {...space, max_time: brim.time().toTs()}

  expect(brim.space(recent).defaultSpanArgs()).toEqual(["now-30m", "now"])
})
