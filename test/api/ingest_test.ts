import {join} from "https://deno.land/std@0.70.0/path/mod.ts"
import {testFile} from "./helper/mod.ts"
import {testApi, assertEquals, uniq} from "./helper/mod.ts"

testApi("ingest log", async (zealot) => {
  const pool = await zealot.pools.create({name: "pool1", order: "desc"})
  const log = testFile("sample.tsv")
  const resp = await zealot.logs.postPaths({paths: [log], poolId: pool.id})
  const messages = await resp.array()

  assertEquals(uniq(messages.map((m: any) => m.type)), [
    "TaskStart",
    "LogPostStatus",
    "LogPostResponse",
    "TaskEnd"
  ])
})

testApi("ingest ndjson log", async (zealot) => {
  const pool = await zealot.pools.create({name: "pool1", order: "desc"})
  const log = testFile("custom-sample.ndjson")
  const resp = await zealot.logs.postPaths({
    paths: [log],
    poolId: pool.id
  })
  await resp.array()

  const {size} = await zealot.pools.get(pool.id)
  assertEquals(size, 4546)
})
