import {uniq} from "lodash"
import data from "test/shared/data"
import {withLake} from "../helpers/with-lake"
import {Zealot} from "../../../zealot"
import fs from "fs"

test("ingest ZNG logs", () => {
  return withLake(async (zealot: Zealot) => {
    const pool = await zealot.pools.create({name: "pool1"})
    let stats = await zealot.pools.stats(pool.id)
    expect(stats).toBeNull()
    const logStream = fs.createReadStream(data.getPath("sample.zng"))
    const addResp = await zealot.pools.add(pool.id, {
      data: logStream
    })
    await zealot.pools.commit(pool.id, addResp.value.commit, {
      message: "test message",
      author: "test author"
    })
    const {size} = await zealot.pools.stats(pool.id)
    expect(size).toBe(5250)
  })
})

test("ingest TSV logs", () => {
  return withLake(async (zealot: Zealot) => {
    const pool = await zealot.pools.create({name: "pool1"})
    let stats = await zealot.pools.stats(pool.id)
    expect(stats).toBeNull()
    const logStream = fs.createReadStream(data.getPath("sample.tsv"))
    const addResp = await zealot.pools.add(pool.id, {
      data: logStream
    })
    await zealot.pools.commit(pool.id, addResp.value.commit, {
      message: "test message",
      author: "test author"
    })
    const {size} = await zealot.pools.stats(pool.id)
    expect(size).toBe(4084)
  })
})

test("ingest NDJSON logs", () => {
  return withLake(async (zealot: Zealot) => {
    const pool = await zealot.pools.create({name: "pool1"})
    let stats = await zealot.pools.stats(pool.id)
    expect(stats).toBeNull()
    const logStream = fs.createReadStream(data.getPath("custom-sample.ndjson"))
    const addResp = await zealot.pools.add(pool.id, {
      data: logStream
    })
    await zealot.pools.commit(pool.id, addResp.value.commit, {
      message: "test message",
      author: "test author"
    })
    const {size} = await zealot.pools.stats(pool.id)
    expect(size).toBe(4467)
  })
})
