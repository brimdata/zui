require("regenerator-runtime/runtime")
const {createReadStream} = require("fs")
const {join} = require("path")
const {withLake} = require("../../dist/test/api/helpers/with-lake")
const env = require("../util/env")

const FILE = join(process.cwd(), process.argv[2])
const QUERY = process.argv[3]

async function ingest(zealot) {
  const pool = await zealot.pools.create({name: "gen space"})
  const add = await zealot.pools.add(pool.id, {
    data: createReadStream(FILE)
  })
  await zealot.pools.commit(pool.id, add.value.commit, {})
  return pool.id
}

withLake(
  async (zealot) => {
    try {
      const poolId = await ingest(zealot)
      const from = new Date(0)
      const to = new Date()
      const search = await zealot.search(QUERY, {poolId, from, to})
      const text = await search.origResp.text()
      console.log(text)
    } catch (e) {
      console.error(e)
    }
  },
  {
    runner: env.zed,
    root: join(__dirname, "__tmproot__"),
    addr: "localhost:9119"
  }
)
