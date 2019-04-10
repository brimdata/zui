/* @flow */

import {remove, ensureDirSync, stat} from "fs-extra"

import download from "./download"

describe.skip("downloading packets", () => {
  const {host, port, username, password} = global.TEST_BOOM
  const path =
    "/space/corelight/packet?ts_sec=1426043018&ts_ns=649889000&duration_sec=0&duration_ns=1636000&proto=udp&src_host=192.168.0.54&src_port=57832&dst_host=192.168.0.1&dst_port=53"
  const dest = "tmp/downloads-test/yo-dawg.pcap"
  const method = "GET"

  afterAll(() => remove("tmp/downloads-test"))

  test("creates directory and downloads file", done => {
    download({host, port, username, password, path, method}, dest)
      .then(file => {
        stat(file)
          .then(stats => {
            expect(stats.isFile()).toBeTruthy()
            done()
          })
          .catch(done)
      })
      .catch(done)
  })

  test("if directory exists, downloads file", done => {
    ensureDirSync("tmp")
    download({host, port, username, password, path, method}, dest)
      .then(_file => {
        done()
      })
      .catch(done)
  })
})
