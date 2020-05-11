/* @flow */
import path from "path"
import zealot from "../../index"
import {ztestDir} from "../env"

describe("zealot client spaces tests", () => {
  const client = zealot.client("localhost:9867")
  let spaceName = "newSpace"
  let spaceID

  const spacePath = (spaceID) => path.join(path.resolve(ztestDir()), spaceID)

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
    spaceID = resp.id
  })

  test("list spaces", async () => {
    const resp = await client.spaces.list()
    expect(resp).toHaveLength(1)
    expect(resp).toEqual([
      {
        ...emptySpace,
        data_path: spacePath(spaceID),
        name: spaceName,
        id: spaceID
      }
    ])
  })

  test("update space", async () => {
    const newName = "updated space name"
    const resp = await client.spaces.update(spaceID, {name: newName})
    expect(resp).toEqual({
      ...emptySpace,
      data_path: spacePath(spaceID),
      name: newName,
      id: spaceID
    })
    spaceName = newName
  })

  test("get space by id", async () => {
    const resp = await client.spaces.get(spaceID)
    expect(resp).toEqual({
      ...emptySpace,
      data_path: spacePath(spaceID),
      name: spaceName,
      id: spaceID
    })
  })

  test("delete space", async () => {
    const resp = await client.spaces.delete(spaceID)
    expect(resp).toBe("")
  })
})
