import {zed} from ".."
import setupLake from "./setup-lake"

const setup = setupLake()

const expectedPool = {
  pool: {
    id: expect.stringContaining("0x"),
    ts: expect.any(Date),
    name: "Hawaii",
    threshold: expect.any(BigInt),
    layout: {
      keys: [["ts"]],
      order: "desc"
    }
  },
  branch: {
    ts: expect.any(Date),
    name: "main",
    commit: expect.stringContaining("0x")
  }
}

test("client", async () => {
  const {client} = setup
  const v = await client.version()

  expect(v).toEqual(expect.objectContaining({version: expect.any(String)}))
})

test("creating a pool", async () => {
  const {client} = setup
  const resp = await client.createPool("Hawaii")
  expect(resp).toEqual(expectedPool)
})

test("query", async () => {
  const {client} = setup
  const r = await client.query("from :pools")
  const data = await r.js()

  expect(data.length).toBe(1)
  expect(data[0]).toEqual(expectedPool.pool)
})

test("event emitters", async () => {
  const {client} = setup
  const r = await client.query("from :branches")

  r.on("row", (row: any) => {
    expect(row).toBeInstanceOf(zed.Record)
  })

  r.on("shape", (shape: any) => {
    expect(shape).toBeInstanceOf(zed.TypeAlias)
  })

  return r.consumed()
})

test("load data", async () => {
  const {client} = setup
  const {pool} = await client.createPool("Load Data Test")
  const data = JSON.stringify(`{id: 1, name: "james"}`)
  const resp = await client.load(data, {
    pool: pool,
    branch: "main"
  })
  console.log(resp)
})
