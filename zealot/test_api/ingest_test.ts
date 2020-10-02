import {join} from "https://deno.land/std/path/mod.ts"
import {testApi, assertEquals, uniq} from "./helper/mod.ts"

testApi("ingest log", async (zealot) => {
  const space = await zealot.spaces.create({name: "space1"})
  const log = join(Deno.cwd(), "data/sample.tsv")
  const resp = await zealot.logs.post({paths: [log], spaceId: space.id})
  const messages = await resp.array()

  assertEquals(uniq(messages.map((m: any) => m.type)), [
    "TaskStart",
    "LogPostStatus",
    "TaskEnd"
  ])
})

testApi("ingest pcap", async (zealot) => {
  const space = await zealot.spaces.create({name: "space1"})
  const path = join(Deno.cwd(), "data/sample.pcap")
  const resp = await zealot.pcaps.post({spaceId: space.id, path})
  const messages = await resp.array()

  assertEquals(uniq(messages.map((m: {type: string}) => m.type)), [
    "TaskStart",
    "PcapPostStatus",
    "TaskEnd"
  ])

  const {span} = await zealot.spaces.get(space.id)
  assertEquals(span, {
    ts: {sec: 1582646585, ns: 983635000},
    dur: {sec: 11, ns: 854892001}
  })
})

testApi("ingest logs with custom type", async (zealot) => {
  const space = await zealot.spaces.create({name: "space1"})
  const log = join(Deno.cwd(), "data/custom-sample.ndjson")
  const typesFile = join(Deno.cwd(), "data/custom-schema.json")
  const types = await Deno.readTextFile(typesFile).then(JSON.parse)
  const resp = await zealot.logs.post({paths: [log], spaceId: space.id, types})
  await resp.array()

  const {span} = await zealot.spaces.get(space.id)
  assertEquals(span, {
    ts: {sec: 1582646585, ns: 983635000},
    dur: {sec: 11, ns: 854892001}
  })
})
