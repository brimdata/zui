import {Lake} from "../lake/lake"
import path from "path"
import {Client} from "./client"
import {removeSync} from "fs-extra"
import _ from "lodash"

const root = path.join(__dirname, "..", "..", "run", "client.test.ts", "root")
const logs = path.join(__dirname, "..", "..", "run", "client.test.ts", "logs")
const lake = new Lake(root, 9000, logs)
const client = new Client("http://localhost:9000")

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

test("collect values", async () => {
  // const resp = await client.query("from 'my-pool' | alice", {})
  // every 30 events or 5.s
  // await resp.collect(({rows, shapes}) => {})
})

test("curl", () => {
  expect(client.curl("* | count()")).toMatchInlineSnapshot(`
    "curl -X POST -d '{\\"query\\":\\"* | count()\\"}' \\\\
      -H \\"Accept: application/x-zjson\\" \\\\
      -H \\"Content-Type: application/json\\" \\\\
      http://localhost:9000/query"
  `)
})
