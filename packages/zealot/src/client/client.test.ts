import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only"
import {Lake} from "../lake/lake"
import path from "path"
import {Client} from "./client"
import {removeSync} from "fs-extra"
import fs from "fs"

const root = path.join(__dirname, "..", "..", "run", "client.test.ts", "root")
const logs = path.join(__dirname, "..", "..", "run", "client.test.ts", "logs")
const lake = new Lake({root, port: 9000, logs})
const client = new Client("http://localhost:9000")
const branchShape = {
  commit: expect.any(String),
  name: expect.any(String),
  ts: expect.any(Date),
}
const poolShape = {
  id: expect.any(String),
  layout: {
    keys: [[expect.any(String)]],
    order: expect.stringMatching(/asc|desc/),
  },
  name: expect.any(String),
  seek_stride: expect.any(Number),
  threshold: expect.any(Number),
  ts: expect.any(Date),
}

beforeAll(async () => {
  removeSync(root)
  removeSync(logs)
  await lake.start()
  await client.createPool("my-pool")
  await client.load('{name: "alice"}', {pool: "my-pool"})
})

afterAll(() => lake.stop())

test("create a lake", async () => {
  const resp = await client.query("from 'my-pool' | alice")
  expect(await resp.js()).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "alice",
      },
    ]
  `)
})

test("#query collector", async () => {
  const data = Array(50)
    .fill(null)
    .map((_, i) => `{value: ${i}}`)
    .join(" ")

  await client.createPool("50-values")
  await client.load(data, {pool: "50-values"})
  const resp = await client.query("from '50-values' | *")

  const fn = jest.fn()
  await resp.collect(fn)
  expect(fn).toHaveBeenCalledTimes(1)
})

test("curl", () => {
  expect(client.curl("* | count()")).toMatchInlineSnapshot(`
    "curl -X POST -d '{\\"query\\":\\"* | count()\\"}' \\\\
      -H \\"Accept: application/x-zjson\\" \\\\
      -H \\"Content-Type: application/json\\" \\\\
      http://localhost:9000/query"
  `)
})

test("#version", async () => {
  const res = await client.version()

  expect(res).toEqual({
    version: expect.any(String),
  })
})

test("#authMethod", async () => {
  const res = await client.authMethod()

  expect(res).toMatchInlineSnapshot(`
    Object {
      "auth0": null,
      "kind": "",
    }
  `)
})

test("#createPool", async () => {
  const res = await client.createPool("created-a-pool")
  expect(res).toEqual({pool: poolShape, branch: branchShape})
})

test("#deletePool", async () => {
  const {
    pool: {id},
  } = await client.createPool("will-delete")

  const res = await client.deletePool(id)
  expect(res).toBe(true)

  await expect(client.getPool(id)).rejects.toEqual(
    new Error(`Pool Not Found: ${id}`)
  )
})

test("#getPools", async () => {
  const res = await client.getPools()
  expect(res.length).toBeGreaterThan(0)
  res.forEach((pool) => {
    expect(pool).toEqual(poolShape)
  })
})

test("#getPool", async () => {
  const res = await client.getPool("my-pool")
  expect(res).toEqual(poolShape)
})

test("#getPoolStats", async () => {
  await client.createPool("pool with span")
  await client.load(`{ts: ${new Date(0).toISOString()}}`, {
    pool: "pool with span",
  })
  const res = await client.getPoolStats("pool with span")
  expect(res).toEqual({
    size: 14,
    span: {
      dur: 1,
      ts: new Date("1970-01-01T00:00:00.000Z"),
    },
  })
})

test("#updatePool", async () => {
  const {
    pool: {id},
  } = await client.createPool("star war")
  await client.updatePool(id, {name: "star peace"})
  const {name} = await client.getPool(id)
  expect(name).toEqual("star peace")
})

test("#load a stream", async () => {
  const {
    pool: {id},
  } = await client.createPool("load-with-stream")
  const stream = fs.createReadStream(
    path.join(__dirname, "../../testdata/sample.zson")
  )
  await client.load(stream, {pool: id})
})

test("#timeout test", async () => {
  jest.useFakeTimers()
  client.fetch = jest.fn((url, opts = {}) => {
    return new Promise((_, reject) => {
      opts.signal?.addEventListener("abort", () =>
        reject("ABORTED IN MOCK TEST")
      )
    })
  })
  const p = client.version()
  jest.advanceTimersByTime(60_000)
  await expect(p).rejects.toEqual("ABORTED IN MOCK TEST")
})
