import brim from "../../src/js/brim"
import {
  ChronoField,
  DateTimeFormatterBuilder,
  LocalDateTime
} from "@js-joda/core"

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

function annotateQuery(query, args) {
  const {
    poolId,
    from = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days
    to = new Date()
  } = args
  const fromTs = dateToNanoTs(from)
  const toTs = dateToNanoTs(to)
  return `from '${poolId}' | ts >= ${fromTs} | ts <= ${toTs} | ${query}`
}

function dateToNanoTs(date) {
  const NanoFormat = new DateTimeFormatterBuilder()
    .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
    .appendFraction(ChronoField.NANO_OF_SECOND, 0, 9, true)
    .appendLiteral("Z")
    .toFormatter()

  return LocalDateTime.parse(brim.time(date).format()).format(NanoFormat)
}

withLake(
  async (zealot) => {
    try {
      const poolId = await ingest(zealot)
      const from = new Date(0)
      const to = new Date()
      const search = await zealot.query(
        annotateQuery(QUERY, {poolId, from, to})
      )
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
