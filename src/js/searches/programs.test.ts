import {INTERVAL, STRING, TIME} from "test/fixtures/zjson-types"
import {ZedPrimitive, ZedRecord, ZedRecordSpec} from "zealot/zed/data-types"
import {connCorrelation} from "./programs"

test("conn correlation", () => {
  const conn: ZedRecordSpec = {
    type: {
      kind: "record",
      fields: [
        {name: "ts", type: TIME},
        {name: "uid", type: STRING},
        {name: "duration", type: INTERVAL},
        {name: "community_id", type: STRING}
      ]
    },
    value: [
      "1425568032.998178",
      "CbOjYpkXn9LfqV51c",
      "0.70995",
      "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU="
    ]
  }
  const record = ZedRecord.deserialize(conn)

  expect(
    connCorrelation(
      record.get("uid") as ZedPrimitive,
      record.get("community_id") as ZedPrimitive,
      record.get("ts") as ZedPrimitive,
      record.get("duration") as ZedPrimitive
    )
  ).toBe(
    'uid="CbOjYpkXn9LfqV51c" or "CbOjYpkXn9LfqV51c" in conn_uids or "CbOjYpkXn9LfqV51c" in uids or referenced_file.uid="CbOjYpkXn9LfqV51c" or (community_id = "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU=" and ts >= 1425568032.998 and ts < 1425568123.707) | head 100'
  )
})
