import {uniq} from "lodash"
import data from "test/shared/data"
import {withLake} from "../helpers/with-lake"
import {Zealot} from "../../../zealot"
import fs from "fs"

test("ingest ZNG logs", () => {
  return withLake(async (zealot: Zealot) => {
    const create = await zealot.pools.create({name: "pool1"})
    let {size} = await zealot.pools.stats(create.pool.id)
    expect(size).toBe(0)
    const logStream = fs.createReadStream(data.getPath("sample.zng"))
    await zealot.pools.load(create.pool.id, create.branch.id, {
      author: "test author",
      message: "test message",
      data: logStream
    });
    ({size} = await zealot.pools.stats(create.pool.id))
    expect(size).toBe(5250)
  })
})

test("ingest TSV logs", () => {
  return withLake(async (zealot: Zealot) => {
    const create = await zealot.pools.create({name: "pool1"})
    let {size} = await zealot.pools.stats(create.pool.id)
    expect(size).toBe(0)
    const logStream = fs.createReadStream(data.getPath("sample.tsv"))
    await zealot.pools.load(create.pool.id, create.branch.id, {
      author: "test author",
      message: "test message",
      data: logStream
    });
    ({size} = await zealot.pools.stats(create.pool.id))
    expect(size).toBe(4084)
  })
})

test("ingest NDJSON logs", () => {
  return withLake(async (zealot: Zealot) => {
    const create = await zealot.pools.create({name: "pool1"})
    let {size} = await zealot.pools.stats(create.pool.id)
    expect(size).toBe(0)
    const logStream = fs.createReadStream(data.getPath("custom-sample.ndjson"))
    await zealot.pools.load(create.pool.id, create.branch.id, {
      author: "test author",
      message: "test message",
      data: logStream
    });
    ({size} = await zealot.pools.stats(create.pool.id))
    expect(size).toBe(4467)
  })
})
