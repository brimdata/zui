/* @flow */
import path from "path"
import zealot from "../../index"
import {ztestDir} from "../env"

describe("zealot client spaces tests", () => {
  const client = zealot.client("localhost:9867")
  let spaceName = "newSpace"
  let spaceId

  const spacePath = (spaceId) => path.join(path.resolve(ztestDir()), spaceId)

  const emptySpace = {
    pcap_path: "",
    pcap_size: 0,
    pcap_support: false,
    size: 0
  }

  test("create space", async () => {
    const resp = await client.spaces.create({name: spaceName})
    expect(resp.name).toBe(spaceName)
    expect(resp.id).toBeDefined()
    spaceId = resp.id
  })

  test("list spaces", async () => {
    const resp = await client.spaces.list()
    expect(resp).toHaveLength(1)
    expect(resp).toEqual([
      {
        ...emptySpace,
        data_path: spacePath(spaceId),
        name: spaceName,
        id: spaceId
      }
    ])
  })

  test("update space", async () => {
    const newName = "updated space name"
    const resp = await client.spaces.update(spaceId, {name: newName})
    expect(resp).toEqual("")
    spaceName = newName
  })

  test("get space by id", async () => {
    const resp = await client.spaces.get(spaceId)
    expect(resp).toEqual({
      ...emptySpace,
      data_path: spacePath(spaceId),
      name: spaceName,
      id: spaceId
    })
  })

  test("delete space", async () => {
    const resp = await client.spaces.delete(spaceId)
    expect(resp).toBe("")
  })
})
