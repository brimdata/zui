import {createRecord} from "test/factories/zed-factory"
import {zed} from "zealot"
import {connCorrelation} from "./programs"

test("conn correlation", () => {
  const record = createRecord({
    ts: new Date(1425568032.998178 * 1000),
    uid: "CbOjYpkXn9LfqV51c",
    duration: new zed.Duration("0.70995s"),
    community_id: "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU="
  })
  expect(
    connCorrelation(
      record.get("uid") as zed.String,
      record.get("community_id") as zed.String,
      record.get("ts") as zed.Time,
      record.get("duration") as zed.Duration
    )
  ).toBe(
    'uid="CbOjYpkXn9LfqV51c" or "CbOjYpkXn9LfqV51c" in conn_uids or "CbOjYpkXn9LfqV51c" in uids or referenced_file.uid="CbOjYpkXn9LfqV51c" or (community_id = "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU=" and ts >= 1425568032.998 and ts < 1425568123.707) | head 100'
  )
})
