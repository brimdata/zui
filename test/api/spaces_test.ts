import {assertEquals, testApi} from "./helper/mod.ts"

testApi("listing the space", async (zealot: any) => {
  await zealot.spaces.create({name: "space1"})
  const spaces = await zealot.spaces.list()
  assertEquals(spaces.length, 1)
})

testApi("creating a space", async (zealot: any) => {
  const space = await zealot.spaces.create({name: "space1"})

  assertEquals(space.name, "space1")
  assertEquals(space.storage_kind, "filestore")
})
