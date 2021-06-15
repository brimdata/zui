import {withLake} from "../helpers/with-lake"

test("listing the pool", () => {
  return withLake(async (zealot: any) => {
    await zealot.pools.create({name: "pool1"})
    const pools = await zealot.pools.list()
    expect(pools.length).toBe(1)
  })
})

test("creating a pool", () => {
  return withLake(async (zealot: any) => {
    const pool = await zealot.pools.create({name: "pool1"})
    expect(pool.name).toBe("pool1")
  })
})
