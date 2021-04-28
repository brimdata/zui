import {join} from "https://deno.land/std@0.70.0/path/mod.ts"
import {testApi, assertEquals, uniq} from "./helper/mod.ts"

testApi("ingest log", async (zealot) => {
  const space = await zealot.spaces.create({name: "space1"})
  const log = join(Deno.cwd(), "data/sample.tsv")
  const resp = await zealot.logs.postPaths({paths: [log], spaceId: space.id})
  const messages = await resp.array()

  assertEquals(uniq(messages.map((m: any) => m.type)), [
    "TaskStart",
    "LogPostStatus",
    "TaskEnd"
  ])
})

testApi("ingest ndjson log", async (zealot) => {
  const space = await zealot.spaces.create({name: "space1"})
  const log = join(Deno.cwd(), "data/custom-sample.ndjson")
  const resp = await zealot.logs.postPaths({
    paths: [log],
    spaceId: space.id
  })
  await resp.array()

  const {span} = await zealot.spaces.get(space.id)
  assertEquals(span, undefined)
})
