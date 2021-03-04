import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {zjson, zng} from "zealot"
import {getCorrelationQuery} from "./get-correlation-query"

test("returns uid query if ts and duration are missing", () => {
  const type = [
    {name: "_path", type: "string"},
    {name: "uid", type: "string"},
    {name: "community_id", type: "string"}
  ] as zjson.Column[]
  const value = ["conn", "CHem0e2rJqHiwjhgq7", "1:NYgcI8mLerCC20GwJVV5AftL0uY="]
  const record = new zng.Record(type, value)

  expect(getCorrelationQuery(record)).toBe(
    uidCorrelation(record.get("uid") as zng.Primitive)
  )
})

test("returns conn query if ts and duration are present", () => {
  const type = [
    {name: "_path", type: "string"},
    {name: "uid", type: "string"},
    {name: "community_id", type: "string"},
    {name: "ts", type: "time"},
    {name: "duration", type: "interval"}
  ] as zjson.Column[]
  const value = [
    "conn",
    "CHem0e2rJqHiwjhgq7",
    "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    "1585852166.003543",
    null
  ]
  const record = new zng.Record(type, value)

  expect(getCorrelationQuery(record)).toBe(connCorrelation(record))
})

test("returns cid query if only cid present", () => {
  const type = [
    {name: "_path", type: "string"},
    {name: "community_id", type: "string"},
    {name: "ts", type: "time"},
    {name: "duration", type: "interval"}
  ] as zjson.Column[]
  const value = [
    "conn",
    "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    "1585852166.003543",
    null
  ]
  const record = new zng.Record(type, value)

  expect(getCorrelationQuery(record)).toBe(
    cidCorrelation(record.get("community_id") as zng.Primitive)
  )
})

test("returns null if no cid or uid", () => {
  const type = [
    {name: "_path", type: "string"},
    {name: "ts", type: "time"},
    {name: "duration", type: "interval"}
  ] as zjson.Column[]
  const value = ["conn", "1585852166.003543", null]
  const record = new zng.Record(type, value)

  expect(getCorrelationQuery(record)).toBe(null)
})
