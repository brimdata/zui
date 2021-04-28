import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {createRecord} from "test/factories/zed-factory"
import {zed} from "zealot"
import {getCorrelationQuery} from "./get-correlation-query"

test("returns uid query if ts and duration are missing", () => {
  const record = createRecord({
    _path: "conn",
    uid: "CHem0e2rJqHiwjhgq7",
    community_id: "1:NYgcI8mLerCC20GwJVV5AftL0uY="
  })

  expect(getCorrelationQuery(record)).toBe(
    uidCorrelation(record.get("uid") as zed.Primitive)
  )
})

test("returns conn query if ts and duration are present", () => {
  const record = createRecord({
    _path: "conn",
    uid: "CHem0e2rJqHiwjhgq7",
    community_id: "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    ts: new Date(1585852166.003543 * 1000),
    duration: null
  })
  expect(getCorrelationQuery(record)).toBe(
    connCorrelation(
      record.get("uid") as zed.Primitive,
      record.get("community_id") as zed.Primitive,
      record.get("ts") as zed.Primitive,
      record.get("duration") as zed.Primitive
    )
  )
})

test("returns cid query if only cid present", () => {
  const record = createRecord({
    _path: "conn",
    community_id: "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    ts: new Date(1585852166.003543 * 1000),
    duration: null
  })

  expect(getCorrelationQuery(record)).toBe(
    cidCorrelation(record.get("community_id") as zed.Primitive)
  )
})

test("returns null if no cid or uid", () => {
  const record = createRecord({
    _path: "conn",
    ts: new Date(1585852166.003543 * 1000),
    duration: null
  })

  expect(getCorrelationQuery(record)).toBe(null)
})
