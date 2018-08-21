/*
The requirement for this test is a boomd instance running with the
host, port, user and pass specified in the constants below. There
must be  more than 10 logs in the default space.
*/

import request from "./request"
import toAst from "./toAst"

const host = "localhost"
const port = "9867"
const user = "james"
const pass = "kerr"
const space = "default"
let from, to

beforeAll(async () => {
  let {min_time, max_time} = await getSpaceTimeExtent(space)
  from = min_time
  to = max_time
})

test("request when unauthorized", done => {
  const path = "/space"

  request({host, port, path, user, pass: "wrong"}).error(error => {
    expect(error).toEqual("permission denied")
    done()
  })
})

test("request when no server running", done => {
  const path = "/space"

  request({host: "none", port, path, user, pass}).error(error => {
    expect(error).toEqual("Error: getaddrinfo ENOTFOUND none none:9867")
    done()
  })
})

test("request for spaces", done => {
  const path = "/space"
  const method = "GET"

  request({host, port, user, pass, method, path, stream: false}).done(
    response => {
      expect(response).toBeInstanceOf(Array)
      done()
    }
  )
})

test("request for a specific space with stream: false", done => {
  const path = "/space/default"
  const method = "GET"

  request({host, port, user, pass, method, path, stream: false}).done(
    payload => {
      expect(payload).toHaveProperty("name", "default")
      expect(payload).toHaveProperty("max_time")
      expect(payload.max_time).toHaveProperty("sec")
      expect(payload.max_time).toHaveProperty("ns")
      expect(payload).toHaveProperty("min_time")
      expect(payload.min_time).toHaveProperty("sec")
      expect(payload.min_time).toHaveProperty("ns")
      done()
    }
  )
})

test("request for search", done => {
  const path = "/search"
  const method = "POST"
  const {proc, search} = toAst("* | head 10")
  const payload = {
    proc,
    search,
    space,
    from,
    to
  }
  request({host, port, user, pass, method, path, payload})
    .channel(0, payload => {
      if (payload.type === "SearchResult") {
        expect(payload).toHaveProperty("results")
        expect(payload.results).toHaveProperty("tuples")
        expect(payload.results.tuples).toBeInstanceOf(Array)
        expect(payload.results.tuples.length).toBe(10)
        expect(payload.results.tuples[9]).toBeInstanceOf(Array)
      }
      expect(payload).toHaveProperty("channel_id", 0)
    })
    .done(done)
})

test("analytics search", done => {
  const path = "/search"
  const method = "POST"
  const {proc, search} = toAst("_path=conn | count() by _path")
  const payload = {
    proc,
    search,
    space,
    to,
    from
  }
  request({host, port, user, pass, method, path, payload}).channel(
    0,
    payload => {
      if (payload.type === "SearchResult") {
        expect(payload).toHaveProperty("results")
        expect(payload.results).toHaveProperty("descriptor")
        expect(payload.results.descriptor.length).toBe(2)
        expect(payload.results).toHaveProperty("tuples")
        expect(payload.results.tuples[0].length).toBe(2)
        done()
      }
    }
  )
})

test("search with events and analytics", done => {
  const path = "/search"
  const method = "POST"
  const {proc, search} = toAst("* | head 10; count() by _path")
  const payload = {
    proc,
    search,
    space,
    to,
    from
  }
  request({host, port, user, pass, method, path, payload})
    .channel(0, payload => {
      if (payload.type === "SearchResult") {
        expect(payload).toHaveProperty("results")
        expect(payload.results).toHaveProperty("descriptor")
        expect(payload.results.descriptor.length).toBe(2)
        expect(payload.results).toHaveProperty("tuples")
        expect(payload.results.tuples[0].length).toBe(2)
      }
    })
    .channel(1, payload => {
      if (payload.type === "SearchResult") {
        expect(payload).toHaveProperty("results")
        expect(payload.results).toHaveProperty("tuples")
        expect(payload.results.tuples).toBeInstanceOf(Array)
        expect(payload.results.tuples.length).toBe(10)
        expect(payload.results.tuples[9]).toBeInstanceOf(Array)
      }
    })
    .done(done)
})

const getSpaceTimeExtent = async name =>
  new Promise((resolve, reject) =>
    request({
      host,
      port,
      user,
      pass,
      method: "GET",
      path: `/space/${name}`,
      stream: false
    })
      .done(resolve)
      .error(reject)
  )
