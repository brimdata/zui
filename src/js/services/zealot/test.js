/* @flow */
import zealot from "./"

describe("search api", () => {
  let client = zealot.client("localhost:9867")
  test("the search params", () => {
    expect(client.inspect().search("count()")).toEqual({
      method: "POST",
      path: "/search",
      body: expect.any(String)
    })
  })

  test("search dfeaults", () => {
    client.searchDefaults({
      space: "corelight",
      from: "Jan 1, 2019",
      to: "Jan 10, 2019"
    })
  })
})

describe("spaces api", () => {
  let client = zealot.client("localhost:9867")

  test("the spaces list api", () => {
    expect(client.inspect().spaces.list()).toEqual({
      method: "GET",
      path: "/space"
    })
  })

  test("the spaces get api", () => {
    expect(client.inspect().spaces.get("awesome")).toEqual({
      method: "GET",
      path: "/space/awesome"
    })
  })

  test("create a space without a name", () => {
    expect(client.inspect().spaces.create()).toEqual({
      method: "POST",
      path: "/space"
    })
  })
})

describe("pcaps api", () => {
  let client = zealot.client("localhost:9867")

  test("get pcaps", () => {
    expect(client.inspect().pcaps.get({space: "hi"})).toEqual({
      method: "GET",
      path: "/space/hi/pcaps"
    })
  })

  test("post pcaps", () => {
    expect(
      client.inspect().pcaps.post({space: "default", file: "~/my/capture.pcap"})
    ).toEqual({
      method: "POST",
      path: "/space/default/pcaps",
      body: expect.any(String)
    })
  })
})
