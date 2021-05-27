import {uniq} from "lodash"
import {itestFile} from "src/js/test/itestFile"
import {withLake} from "./helpers/with-lake"

test("ingest log", () => {
  return withLake(async (zealot) => {
    const pool = await zealot.pools.create({name: "pool1"})
    const log = itestFile("sample.tsv")

    const resp = await zealot.logs.postPaths({
      paths: [log.path],
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
    const log = itestFile("custom-sample.ndjson")
    const resp = await zealot.logs.postPaths({
      paths: [log.path],
      poolId: pool.id
    })
    await resp.array()

    const {size} = await zealot.pools.get(pool.id)
    expect(size).toBe(4467)
  })
})
