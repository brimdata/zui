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
    duration: new zed.Duration("0")
  })
  expect(getCorrelationQuery(record)).toBe(
    connCorrelation(
      record.get<zed.String>("uid"),
      record.get<zed.String>("community_id"),
      record.get<zed.Time>("ts"),
      record.get<zed.Duration>("duration")
    )
  )
})

test("returns cid query if only cid present", () => {
  const record = createRecord({
    _path: "conn",
    community_id: "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    ts: new Date(1585852166.003543 * 1000),
    duration: new zed.Duration("0")
  })

  expect(getCorrelationQuery(record)).toBe(
    cidCorrelation(record.get<zed.String>("community_id"))
  )
})

test("returns null if no cid or uid", () => {
  const record = createRecord({
    _path: "conn",
    ts: new Date(1585852166.003543 * 1000),
    duration: new zed.Duration("0")
  })

  expect(getCorrelationQuery(record)).toBe(null)
})
