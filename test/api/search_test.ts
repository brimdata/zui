import {
  spy,
  testApi,
  assertEquals,
  assertCalledWith,
  testFile,
  uniq
} from "./helper/mod.ts"

async function setup(zealot: any) {
  const pool = await zealot.pools.create({name: "pool1"})
  const log = testFile("sample.tsv")
  const resp = await zealot.logs.postPaths({paths: [log], poolId: pool.id})
  await resp.array()

  zealot.setSearchOptions({
    poolId: pool.id,
    from: new Date(0),
    to: new Date(),
    enhancers: []
  })
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
  const start = spy()
  const end = spy()

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

  assertCalledWith(start, {task_id: 0, type: "TaskStart"})
  assertCalledWith(end, {task_id: 0, type: "TaskEnd"})
})

testApi("search#callbacks record", async (zealot: any) => {
  await setup(zealot)
  const resp = await zealot.search('_path=="conn" | sort ts | head 1')
  const records = spy()
  await new Promise((resolve, reject) => {
    resp
      .callbacks()
      .records(records)
      .end(resolve)
      .error(reject)
  })

  const args = records.calls[0].args[0]
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
    assertEquals(chunk instanceof Uint8Array, true)
  }
})

testApi("search with abortController", async (zealot: any) => {
  await setup(zealot)
  const onAbort = spy()
  const ctl = new AbortController()
  ctl.signal.onabort = onAbort
  const resp = await zealot.search("*", {signal: ctl.signal})
  ctl.abort()
  resp.origResp.body?.cancel()

  assertEquals(onAbort.calls.length, 1)
})
