/* @flow */

import {conn, dns, weird} from "../test/mockLogs"
import {logsMenu} from "./logsMenu"
import mockSpace from "../test/mockSpace"

describe("Log Right Click", () => {
  const space = mockSpace()
  const program = "*"

  test("conn log with pcap support", () => {
    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = logsMenu(program, space)(field, log)

    expect(menu).toMatchSnapshot()
  })

  test("conn log without pcap support", () => {
    space.packet_support = false

    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = logsMenu(program, space)(field, log)

    expect(menu).toMatchSnapshot()
  })

  test("dns log", () => {
    const log = dns()
    const field = log.getField("query")
    const menu = logsMenu(program, space)(field, log)

    expect(menu).toMatchSnapshot()
  })

  test("time field for weird log", () => {
    const log = weird()
    const field = log.getField("ts")
    const menu = logsMenu(program, space)(field, log)

    expect(menu).toMatchSnapshot()
  })

  test("time field for conn log", () => {
    const log = conn()
    const field = log.getField("ts")
    const menu = logsMenu(program, space)(field, log)

    expect(menu).toMatchSnapshot()
  })
})
