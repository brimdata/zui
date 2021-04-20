import {
  join,
  fromFileUrl,
  dirname
} from "https://deno.land/std@0.70.0/path/mod.ts"
import {withZqd} from "../../test/api/helper/test_api.ts"

const FILE = join(Deno.cwd(), Deno.args[0])
const QUERY = Deno.args[1]

async function ingest(zealot: any) {
  const space = await zealot.spaces.create({name: "gen space"})
  const ingest = await zealot.logs.postPaths({paths: [FILE], spaceId: space.id})
  await ingest.origResp.text()
  return space.id
}

withZqd(async (zealot) => {
  try {
    const spaceId = await ingest(zealot)
    const from = new Date(0)
    const to = new Date()
    const search = await zealot.search(QUERY, {spaceId, from, to})
    const text = await search.origResp.text()
    console.log(text)
  } catch (e) {
    console.error(e)
  }
})
