import {withLake} from "../helpers/with-lake"

test("list pools", () => {
  return withLake(async (zealot: any) => {
    await zealot.pools.create({name: "pool1"})
    const pools = await zealot.pools.list()
    expect(pools.length).toBe(1)
  })
})

test("create a pool", () => {
  return withLake(async (zealot: any) => {
    const {pool} = await zealot.pools.create({name: "pool1"})
    expect(pool.name).toBe("pool1")
  })
})

test("get pool", () => {
  return withLake(async (zealot: any) => {
    const meta = await zealot.pools.create({name: "pool1"})
    let pool = await zealot.pools.get(meta.pool.id)
    expect(pool.name).toBe("pool1")
    pool = await zealot.pools.get("pool1")
    expect(pool.name).toBe("pool1")
  })
})

test("get non-existant pool", () => {
  return withLake(async (zealot: any) => {
    await expect(zealot.pools.get("pool1")).rejects.toEqual(
      new Error("pool not found")
    )
  })
})
