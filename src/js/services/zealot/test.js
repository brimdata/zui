/* @flow */
import zealot from "./"

describe("search api", () => {
  let client = zealot.client("localhost:9867")
  test("the search params", () => {
    expect(client.inspect().search("count()")).toEqual({
      method: "POST",
      path: "/search?format=zjson",
      body: expect.any(String)
    })
  })

  test("search defaults", () => {
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

  test("delete a space with a name", () => {
    expect(client.inspect().spaces.delete("my-space")).toEqual({
      method: "DELETE",
      path: "/space/my-space"
    })
  })
})

describe("ingest api", () => {
  let client = zealot.client("localhost:9867")

  test("get pcaps", () => {
    expect(client.inspect().pcaps.get({space: "hi"})).toEqual({
      method: "GET",
      path: "/space/hi/packet"
    })
  })

  test("post pcaps", () => {
    expect(
      client.inspect().pcaps.post({space: "default", file: "~/my/capture.pcap"})
    ).toEqual({
      method: "POST",
      path: "/space/default/packet",
      body: expect.any(String)
    })
  })

  test("post zeek", () => {
    let paths = ["~/zeek/1.log", "~/zeek/2.log"]
    expect(client.inspect().logs.post({space: "default", paths})).toEqual({
      method: "POST",
      path: "/space/default/log",
      body: JSON.stringify({paths})
    })
  })

  test("post zeek json with default types", () => {
    let paths = ["~/zeek/1.log", "~/zeek/2.log"]
    let data = client
      .inspect()
      .logs.post({space: "default", paths, types: "default"})

    expect(JSON.parse(data.body).json_types_config).toEqual(expect.any(Object))
  })
})
