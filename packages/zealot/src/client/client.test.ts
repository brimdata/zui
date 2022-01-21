import {Lake} from "../lake/lake"
import path from "path"
import {Client} from "./client"
import {removeSync} from "fs-extra"

const root = path.join(__dirname, "..", "..", "run", "client.test.ts", "root")
const logs = path.join(__dirname, "..", "..", "run", "client.test.ts", "logs")
const lake = new Lake(root, 9000, logs)

beforeAll(async () => {
  removeSync(root)
  removeSync(logs)
  await lake.start()
})

afterAll(() => lake.stop())

test("create a lake", async () => {
  const client = new Client("localhost:9000")

  console.log(await client.createPool("my-pool"))
  console.log(await client.load('{name: "james"}', {pool: "my-pool"}))

  console.log(await client.query("from 'my-pool' | james"))
})
