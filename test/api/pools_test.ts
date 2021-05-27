import {assertEquals, testApi} from "./helper/mod.ts"

const defaultLayout = {keys: [["ts"]], order: "desc"}

testApi("listing the pool", async (zealot: any) => {
  await zealot.pools.create({name: "pool1", layout: defaultLayout})
  const pools = await zealot.pools.list()
  assertEquals(pools.length, 1)
})

testApi("creating a pool", async (zealot: any) => {
  const pool = await zealot.pools.create({name: "pool1", layout: defaultLayout})
  assertEquals(pool.name, "pool1")
  assertEquals(pool.layout, {keys: [["ts"]], order: "desc"})
})

testApi("pool stats", async (zealot: any) => {
  const {id} = await zealot.pools.create({name: "pool1", layout: defaultLayout})
  const stats = await zealot.pools.stats(id)
  assertEquals(stats, {size: 0, span: null})
})
