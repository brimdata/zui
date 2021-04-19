import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {INTERVAL, STRING, TIME} from "test/fixtures/zjson-types"
import {ZedPrimitive, ZedRecord} from "zealot/zed/data-types"
import {RecordFieldType, RecordType} from "zealot/zed/zjson"
import {getCorrelationQuery} from "./get-correlation-query"

test("returns uid query if ts and duration are missing", () => {
  const type = {
    kind: "record",
    fields: [
      {name: "_path", type: STRING},
      {name: "uid", type: STRING},
      {name: "community_id", type: STRING}
    ]
  } as RecordType
  const value = ["conn", "CHem0e2rJqHiwjhgq7", "1:NYgcI8mLerCC20GwJVV5AftL0uY="]
  const record = new ZedRecord({type, value})

  expect(getCorrelationQuery(record)).toBe(
    uidCorrelation(record.get("uid") as ZedPrimitive)
  )
})

test("returns conn query if ts and duration are present", () => {
  const type = [
    {name: "_path", type: STRING},
    {name: "uid", type: STRING},
    {name: "community_id", type: STRING},
    {name: "ts", type: TIME},
    {name: "duration", type: INTERVAL}
  ] as RecordFieldType[]
  const value = [
    "conn",
    "CHem0e2rJqHiwjhgq7",
    "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    "1585852166.003543",
    null
  ]
  const record = ZedRecord.of(type, value)

  expect(getCorrelationQuery(record)).toBe(
    connCorrelation(
      record.get("uid") as ZedPrimitive,
      record.get("community_id") as ZedPrimitive,
      record.get("ts") as ZedPrimitive,
      record.get("duration") as ZedPrimitive
    )
  )
})

test("returns cid query if only cid present", () => {
  const type = [
    {name: "_path", type: STRING},
    {name: "community_id", type: STRING},
    {name: "ts", type: TIME},
    {name: "duration", type: INTERVAL}
  ] as RecordFieldType[]
  const value = [
    "conn",
    "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    "1585852166.003543",
    null
  ]
  const record = ZedRecord.of(type, value)

  expect(getCorrelationQuery(record)).toBe(
    cidCorrelation(record.get("community_id") as ZedPrimitive)
  )
})

test("returns null if no cid or uid", () => {
  const type = [
    {name: "_path", type: STRING},
    {name: "ts", type: TIME},
    {name: "duration", type: INTERVAL}
  ] as RecordFieldType[]
  const value = ["conn", "1585852166.003543", null]
  const record = ZedRecord.of(type, value)

  expect(getCorrelationQuery(record)).toBe(null)
})
