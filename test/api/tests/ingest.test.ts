import {uniq} from "lodash"
import data from "test/shared/data"
import {withLake} from "../helpers/with-lake"

test("ingest log", () => {
  return withLake(async (zealot) => {
    const pool = await zealot.pools.create({name: "pool1"})
    const log = data.getPath("sample.tsv")

    const resp = await zealot.logs.postPaths({
      paths: [log],
      poolId: pool.id
    })
    const messages = await resp.array()
    expect(uniq(messages.map((m: any) => m.type))).toEqual([
      "TaskStart",
      "LogPostStatus",
      "LogPostResponse",
      "TaskEnd"
    ])
  })
})

test("ingest ndjson", () => {
  return withLake(async (zealot) => {
    const pool = await zealot.pools.create({name: "pool1"})
    const log = data.getPath("custom-sample.ndjson")
    const resp = await zealot.logs.postPaths({
      paths: [log],
      poolId: pool.id
    })
    await resp.array()

    const {size} = await zealot.pools.stats(pool.id)
    expect(size).toBe(4467)
  })
})
