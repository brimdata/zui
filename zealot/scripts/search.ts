import {
  join,
  fromFileUrl,
  dirname
} from "https://deno.land/std@0.70.0/path/mod.ts"
import {withZqd} from "../test_api/helper/test_api.ts"

const DIR = dirname(fromFileUrl(import.meta.url))
const FILE = join(DIR, "../test_api/data/sample.tsv")

async function ingest(zealot: any) {
  const space = await zealot.spaces.create({name: "gen space"})
  const ingest = await zealot.logs.post({paths: [FILE], spaceId: space.id})
  await ingest.origResp.text()
  return space.id
}

withZqd(async (zealot) => {
  try {
    const spaceId = await ingest(zealot)
    const from = new Date(0)
    const to = new Date()
    const zql = Deno.args[0]
    const search = await zealot.search(zql, {spaceId, from, to})
    const text = await search.origResp.text()
    console.log(text)
  } catch (e) {
    console.error(e)
  }
})
