/* @flow */

import L from "lookytalk"
import http from "http"
import BoomClient, {LookyTalk, Handler} from "./index"
import H from "./lib/Handler"

test("export looktalk as named export", () => {
  expect(LookyTalk).toBe(L)
})

test("export Handler", () => {
  expect(Handler).toBe(H)
})

let boom
beforeEach(() => {
  boom = new BoomClient({
    host: "localhost",
    port: 9867,
    adapter: "NodeRequest"
  })
})

test("#constructor with no options", () => {
  expect(boom.getOptions()).toEqual({
    enableCache: true,
    enableIndex: true,
    adapter: expect.any(String),
    host: "localhost",
    password: "",
    port: 9867,
    searchQueryParams: {},
    searchSpace: "default",
    searchSpan: [expect.any(Date), expect.any(Date)],
    timeout: 0,
    username: ""
  })
})

test("#setOptions", () => {
  boom.setOptions({port: 1111})

  const {host, port} = boom.getOptions()

  expect(host).toBe("localhost")
  expect(port).toBe(1111)
})

test("#clientVersion", () => {
  expect(boom.clientVersion()).toHaveProperty("lookytalk")
})

describe.skip("external tests (need a running boomd)", () => {
  test("#serverVersion", done => {
    boom
      .serverVersion()
      .then(version => {
        expect(version).toHaveProperty("boomd")
        expect(version).toHaveProperty("lookytalk")
        done()
      })
      .catch(done)
  })

  test("#search", done => {
    boom.setOptions({
      searchSpace: "default",
      searchSpan: [new Date("2015-04-01"), new Date("2015-04-13")]
    })

    let tuples = []
    boom
      .search("* | head 100")
      .channel(0, payload => {
        if (payload.type === "SearchResult")
          tuples = [...tuples, ...payload.results.tuples]
      })
      .done(() => {
        expect(tuples).toHaveLength(100)
        done()
      })
      .error(done)
  })

  test("#search with options", done => {
    boom.setOptions({
      searchSpace: "default",
      searchSpan: [new Date("2015-04-01"), new Date("2015-04-13")]
    })

    boom.search("* | head 100", {searchSpace: "foo-foo-bar-bar"}).error(e => {
      expect(e).toMatch("SPACE_NOT_FOUND")
      done()
    })
  })

  test("#search with defaults", () => {
    const request = jest.spyOn(http, "request")

    boom.search("* | count()")

    expect(request).toBeCalledWith(
      "http://localhost:9867/search",
      expect.any(Object)
    )
  })

  test("#search with cache disabled", () => {
    const request = jest.spyOn(http, "request")

    boom.setOptions({
      enableCache: false,
      enableIndex: false
    })

    boom.search("* | count()")

    expect(request).toBeCalledWith(
      "http://localhost:9867/search?rewrite=f&useindex=f",
      expect.any(Object)
    )
  })

  describe("#spaces", () => {
    const tempSpace = `temp-space-${new Date().getTime()}`

    test("#list", done => {
      boom.spaces
        .list()
        .then(spaces => {
          expect(spaces).toBeInstanceOf(Array)
          done()
        })
        .catch(done)
    })

    test("#get", done => {
      boom.spaces
        .get("default")
        .then(space => {
          expect(space).toEqual(
            expect.objectContaining({
              name: expect.any(String),
              packet_support: expect.any(Boolean),
              compression: expect.any(String),
              size: expect.any(Number),
              min_time: {
                ns: expect.any(Number),
                sec: expect.any(Number)
              },
              max_time: {
                ns: expect.any(Number),
                sec: expect.any(Number)
              }
            })
          )
          done()
        })
        .catch(done)
    })

    test("#create", done => {
      boom.spaces
        .create({
          name: tempSpace,
          config: {compression: "snappy"}
        })
        .then(response => {
          expect(response).toEqual(
            expect.objectContaining({
              name: tempSpace,
              compression: "snappy"
            })
          )
          done()
        })
        .catch(done)
    })

    test("#delete", done => {
      boom.spaces
        .delete(tempSpace)
        .then(_ => done())
        .catch(done)
    })
  })

  describe("#descriptors", () => {
    test("#list", done => {
      boom.descriptors
        .list("default")
        .then(list => {
          expect(list).toHaveLength(19)
          done()
        })
        .catch(done)
    })

    test("#get", done => {
      boom.descriptors
        .get("default", 0)
        .then(response => {
          expect(response[0]).toEqual({name: "_td", type: "int"})
          done()
        })
        .catch(done)
    })
  })

  describe("#tasks", () => {
    test("#list", done => {
      boom.tasks
        .list()
        .then(response => {
          expect(response[0]).toEqual(
            expect.objectContaining({
              tid: expect.any(Number),
              name: "http",
              state: "running",
              start_time: {
                ns: expect.any(Number),
                sec: expect.any(Number)
              },
              info: expect.any(Object)
            })
          )
          done()
        })
        .catch(done)
    })
  })

  describe.skip("#packets", () => {
    test("get", done => {
      const space = "corelight"
      const destDir = "tmp/client-test"
      const options = {
        destDir,
        dst_host: "213.155.151.149",
        dst_port: "80",
        duration_ns: 445091000,
        duration_sec: 8,
        proto: "tcp",
        space,
        src_host: "192.168.0.2",
        src_port: "33639",
        ts_ns: 290534000,
        ts_sec: 1425612624
      }

      boom.packets
        .get(options)
        .then(_ => {
          done()
        })
        .catch(done)
    })
  })
})
