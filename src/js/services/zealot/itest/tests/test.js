/* @flow */

import zealot from "../../index"

describe("zealot client tests", () => {
  const client = zealot.client("localhost:9867")
  const spaceName = "newSpace"
  let spaceID

  test("post space", async () => {
    const spaceResp = await client.spaces.create({name: spaceName})
    console.log("post resp is: ", spaceResp)
    expect(spaceResp.name).toBe(spaceName)
    expect(spaceResp.id).toBeDefined()
    spaceID = spaceResp.id
  })

  test("list spaces", async () => {
    const listSpaceResp = await client.spaces.list()
    console.log("list resp is: ", listSpaceResp)
    expect(listSpaceResp).toHaveLength(1)
    expect(listSpaceResp).toContainEqual({name: spaceName, id: spaceID})
  })
})
