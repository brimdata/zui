import {assertEquals, testApi} from "./helper/mod.ts"

testApi("listing the pool", async (zealot: any) => {
  await zealot.pools.create({name: "pool1"})
  const pools = await zealot.pools.list()
  assertEquals(pools.length, 1)
})

testApi("creating a pool", async (zealot: any) => {
  const pool = await zealot.pools.create({name: "pool1"})
  assertEquals(pool.name, "pool1")
})
