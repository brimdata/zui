/* @flow */
import brim from "./"

let records = [
  {
    id: 0,
    type: [
      {name: "ts", type: "time"},
      {name: "_path", type: "string"},
      {name: "count", type: "count"}
    ],
    values: ["1428917670.000000000", "dns", "2"]
  },
  {id: 0, values: ["1428917670.000000000", "conn", "3"]},
  {id: 0, values: ["1428917670.000000000", "capture_loss", "1"]},
  {id: 0, values: ["1428917640.000000000", "conn", "1"]}
]

test("coverts to an array of records", () => {
  let collector = brim.recordsBuffer()
  collector.add("0", records)
  expect(collector.records()).toMatchSnapshot()
})
