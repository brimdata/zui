import {itestFile} from "src/js/test/itestFile"
import {uniq} from "zealot/util/utils"
import {withLake} from "./helpers/with-lake"

async function setup(zealot: any) {
  const pool = await zealot.pools.create({name: "pool1"})
  const log = itestFile("sample.tsv")
  const resp = await zealot.logs.postPaths({paths: [log.path], poolId: pool.id})
  await resp.array()

  zealot.setSearchOptions({
    poolId: pool.id,
    from: new Date(0),
    to: new Date(),
    enhancers: []
  })
}

function testApi(name, fn) {
  test(name, () => withLake(fn))
}

function assertEquals(a, b) {
  expect(a).toEqual(b)
}

testApi("search#records", async (zealot) => {
  await setup(zealot)
  const resp = await zealot.search("* | sort ts")
  const results = await resp.records()

  assertEquals(results.length, 30)
})

testApi("search#iterator", async (zealot) => {
  await setup(zealot)

  const stream = await zealot.search("* | sort ts")
  const types = []
  for await (const payload of stream) {
    types.push(payload.type)
  }

  assertEquals(uniq(types), [
    "TaskStart",
    "SearchRecords",
    "SearchEnd",
    "SearchStats",
    "TaskEnd"
  ])
})

testApi("search#callbacks start and end", async (zealot: any) => {
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

testApi("search#callbacks record", async (zealot: any) => {
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
  assertEquals(Object.keys(args), ["channel", "rows", "newRows", "schemas"])
  assertEquals(args.channel, 0)
  assertEquals(Object.keys(args.schemas).length, 1)
  assertEquals(args.newRows.length, 1)
  assertEquals(args.rows.length, 1)
})

testApi("search#originResponse format=zng", async (zealot: any) => {
  await setup(zealot)
  const resp = await zealot.search("*", {format: "zng", controlMessages: false})
  for await (const chunk of resp.origResp.body) {
    assertEquals(chunk instanceof Buffer, true) // in node its a buffer, in browser a Uint8Array
  }
})

testApi("search with abortController", async (zealot: any) => {
  await setup(zealot)
  const onAbort = jest.fn()
  const ctl = new AbortController()
  ctl.signal.onabort = onAbort
  await zealot.search("*", {signal: ctl.signal})
  ctl.abort()

  expect(onAbort).toHaveBeenCalled()
})
