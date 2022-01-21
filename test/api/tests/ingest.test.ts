import data from "test/shared/data"
import {withLake} from "../helpers/with-lake"
import {Zealot} from "../../../zealot-old"
import fs from "fs"

test("ingest ZNG logs", () => {
  return withLake(async (zealot: Zealot) => {
    const {pool, branch} = await zealot.pools.create({name: "pool1"})
    let {size} = await zealot.pools.stats(pool.id)
    expect(size).toBe(0)
    const logStream = fs.createReadStream(data.getPath("sample.zng"))
    await zealot.pools.load(pool.id, branch.name, {
      author: "test author",
      body: "test message",
      data: logStream
    })
    ;({size} = await zealot.pools.stats(pool.id))
    expect(size).toBe(1148)
  })
})

test("ingest TSV logs", () => {
  return withLake(async (zealot: Zealot) => {
    const {pool, branch} = await zealot.pools.create({name: "pool1"})
    let {size} = await zealot.pools.stats(pool.id)
    expect(size).toBe(0)
    const logStream = fs.createReadStream(data.getPath("sample.tsv"))
    await zealot.pools.load(pool.id, branch.name, {
      author: "test author",
      body: "test message",
      data: logStream
    })
    ;({size} = await zealot.pools.stats(pool.id))
    expect(size).toBe(3758)
  })
})

test("ingest NDJSON logs", () => {
  return withLake(async (zealot: Zealot) => {
    const {pool, branch} = await zealot.pools.create({name: "pool1"})
    let {size} = await zealot.pools.stats(pool.id)
    expect(size).toBe(0)
    const logStream = fs.createReadStream(data.getPath("custom-sample.ndjson"))
    await zealot.pools.load(pool.id, branch.name, {
      author: "test author",
      body: "test message",
      data: logStream
    })
    ;({size} = await zealot.pools.stats(pool.id))
    expect(size).toBe(3754)
  })
})
