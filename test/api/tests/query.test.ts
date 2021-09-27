import {createReadStream} from "fs"
import {uniq} from "lodash"
import {withLake} from "../helpers/with-lake"
import data from "test/shared/data"
import {useResponse} from "../../shared/responses"

const testPool = "pool1"

async function setup(zealot: any) {
  const {pool, branch} = await zealot.pools.create({name: "pool1"})
  await zealot.pools.load(pool.id, branch.name, {
    author: "test author",
    body: "test message",
    data: createReadStream(data.getPath("sample.tsv"))
  })

  zealot.setQueryOptions({
    poolId: pool.id,
    from: new Date(0),
    to: new Date(),
    enhancers: []
  })
}

test("search#callbacks start, end, and channelEnd", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const resp = await zealot.query(`from ${testPool} | *`)
    const start = jest.fn()
    const end = jest.fn()
    const chanEnd = jest.fn()

    await new Promise<void>((resolve, reject) => {
      resp
        .callbacks()
        .start(start)
        .end(() => {
          end()
          resolve()
        })
        .channelEnd(chanEnd)
        .error(reject)
    })

    expect(start).toHaveBeenCalled()
    expect(end).toHaveBeenCalled()
    expect(chanEnd).toHaveBeenCalledWith({channel_id: 0})
  })
})

test("search#records", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const resp = await zealot.query(`from ${testPool} | * | sort ts`)
    const results = await resp.records()

    expect(results.length).toBe(30)
  })
})

test("search#iterator", () => {
  return withLake(async (zealot) => {
    await setup(zealot)

    const stream = await zealot.query(`from ${testPool} | * | sort ts`)
    const kinds = []
    for await (const payload of stream) {
      kinds.push(payload.kind)
    }

    expect(uniq(kinds)).toEqual([
      "QueryChannelSet",
      "Object",
      "QueryChannelEnd",
      "QueryStats"
    ])
  })
})

test("search#callbacks record", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const req = await zealot.query(
      `from ${testPool} | _path=="conn" | sort ts | head 1`
    )
    const recordCb = jest.fn()
    await new Promise((res, rej) =>
      req
        .callbacks()
        .record(recordCb)
        .error(rej)
        .end(res)
    )

    const args = recordCb.mock.calls[0][0]
    expect(Object.keys(args)).toEqual(["schema", "types", "values"])
    expect(args.schema).toBe("27")
    expect(Object.keys(args.values).length).toBe(19)
    expect(args.types).toEqual([
      {kind: "typedef", name: "27", type: expect.any(Object)}
    ])
  })
})

test("search#originResponse format=zng", () => {
  return withLake(async (zealot) => {
    await setup(zealot)
    const resp = await zealot.query(`from ${testPool} | *`, {
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
    await zealot.query(`from ${testPool} | *`, {signal: ctl.signal})
    ctl.abort()

    expect(onAbort).toHaveBeenCalled()
  })
})
