require("regenerator-runtime/runtime")
const {createReadStream} = require("fs")
const {join} = require("path")
const {withLake} = require("../../dist/test/api/helpers/with-lake")
const env = require("../util/env")

const FILE = join(process.cwd(), process.argv[2])
const QUERY = process.argv[3]

async function ingest(zealot) {
  const {pool, branch} = await zealot.pools.create({name: "gen space"})
  await zealot.pools.load(pool.id, branch.name, {
    data: createReadStream(FILE)
  })
  return {poolId: pool.id, branch: branch.name}
}

withLake(
  async (zealot) => {
    try {
      const poolId = await ingest(zealot)
      const from = new Date(0).toISOString()
      const to = new Date().toISOString()
      const annotatedQuery = `from '${poolId}' | ts >= ${from} | ts <= ${to} | ${QUERY}`
      const search = await zealot.query(annotatedQuery)
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
