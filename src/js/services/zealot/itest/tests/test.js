/* @flow */

import zealot from "../../index"

describe("zealot client tests", () => {
  const client = zealot.client("localhost:9867")

  test("post space", async () => {
    const resp = await client.spaces.list()
    console.log(resp)
    expect(resp.status).toBe(200)
  })
})
