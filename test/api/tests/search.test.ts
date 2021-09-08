import {createReadStream} from "fs"
import {uniq} from "lodash"
import {withLake} from "../helpers/with-lake"
import data from "test/shared/data"

async function setup(zealot: any) {
  const {pool, branch} = await zealot.pools.create({name: "pool1"})
  await zealot.pools.load(pool.id, branch.name, {
    author: "test author",
    body: "test message",
    data: createReadStream(data.getPath("sample.tsv"))
  })

  zealot.setSearchOptions({
    poolId: pool.id,
    from: new Date(0),
    to: new Date(),
    enhancers: []
  })
}

test("search#records", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const resp = await zealot.search("* | sort ts")
    const results = await resp.records()

    expect(results.length).toBe(30)
  })
})

test("search#iterator", () => {
  return withLake(async (zealot) => {
    await setup(zealot)

    const stream = await zealot.search("* | sort ts")
    const types = []
    for await (const payload of stream) {
      types.push(payload.type)
    }

    expect(uniq(types)).toEqual([
      "TaskStart",
      "SearchRecords",
      "SearchEnd",
      "SearchStats",
      "TaskEnd"
    ])
  })
})

test("search#callbacks start and end", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const resp = await zealot.search("*")
    const start = jest.fn()
    const end = jest.fn()

    await new Promise<void>((resolve, reject) => {
      resp
        .callbacks()
        .start(start)
        .end((args: any) => {
          end(args)
          resolve()
        })
        .error(reject)
    })

    expect(start).toHaveBeenCalledWith({task_id: 0, type: "TaskStart"})
    expect(end).toHaveBeenCalledWith({task_id: 0, type: "TaskEnd"})
  })
})

test("search#callbacks record", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const resp = await zealot.search('_path=="conn" | sort ts | head 1')
    const records = jest.fn()
    await new Promise((resolve, reject) => {
      resp
        .callbacks()
        .records(records)
        .end(resolve)
        .error(reject)
    })

    const args = records.mock.calls[0][0]
    expect(Object.keys(args)).toEqual(["channel", "rows", "newRows", "schemas"])
    expect(args.channel).toBe(0)
    expect(Object.keys(args.schemas).length).toBe(1)
    expect(args.newRows.length).toBe(1)
    expect(args.rows.length).toBe(1)
  })
})

test("search#originResponse format=zng", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const resp = await zealot.search("*", {
      format: "zng",
      controlMessages: false
    })
    for await (const chunk of resp.origResp.body) {
      expect(chunk).toBeInstanceOf(Buffer) // in node its a buffer, in browser a Uint8Array
    }
  })
})

test("search with abortController", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const onAbort = jest.fn()
    const ctl = new AbortController()
    ctl.signal.onabort = onAbort
    await zealot.search("*", {signal: ctl.signal})
    ctl.abort()

    expect(onAbort).toHaveBeenCalled()
  })
})
