/* @flow */

import {conn, dns, weird} from "../test/mockLogs"
import cellMenu from "./cellMenu"
import mockSpace from "../test/mockSpace"

function menuText(menu) {
  return menu.map((item) => item.label).join(", ")
}

describe("Log Right Click", () => {
  const space = mockSpace()
  const program = "*"

  test("conn log with pcap support", () => {
    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = cellMenu(program, log.descriptor.map((c) => c.name), space)(
      field,
      log
    )

    expect(menuText(menu)).toMatch(/pcaps/i)
  })

  test("conn log without pcap support", () => {
    space.packet_support = false

    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = cellMenu(program, log.descriptor.map((c) => c.name), space)(
      field,
      log
    )

    expect(menuText(menu)).not.toMatch(/pcaps/i)
  })

  test("dns log", () => {
    const log = dns()
    const field = log.getField("query")
    const menu = cellMenu(program, log.descriptor.map((c) => c.name), space)(
      field,
      log
    )

    expect(menuText(menu)).toMatch(/virustotal/i)
    expect(menuText(menu)).toMatch(/count by/i)
  })

  test("time field for weird log", () => {
    const log = weird()
    const field = log.getField("ts")
    const menu = cellMenu(program, log.descriptor.map((c) => c.name), space)(
      field,
      log
    )

    expect(menuText(menu)).toMatch(/"start" time/i)
    expect(menuText(menu)).toMatch(/"end" time/i)
  })

  test("time field for conn log", () => {
    const log = conn()
    const field = log.getField("ts")
    const menu = cellMenu(program, log.descriptor.map((c) => c.name), space)(
      field,
      log
    )

    expect(menuText(menu)).toMatch(/"start" time/i)
    expect(menuText(menu)).toMatch(/"end" time/i)
  })
})

describe("Analysis Right Click", () => {
  const program = "* | count() by id.orig_h"
  const space = mockSpace()

  test("address field", () => {
    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = cellMenu(program, log.descriptor.map((c) => c.name), space)(
      field,
      log
    )

    expect(menuText(menu)).toMatch(/whois/i)
  })

  test("non-address field", () => {
    const log = conn()
    const field = log.getField("proto")
    const menu = cellMenu(
      "* | count() by proto",
      log.descriptor.map((c) => c.name),
      space
    )(field, log)

    expect(menuText(menu)).toMatch(/pivot/i)
  })

  test("group by proc", () => {
    const log = conn()
    const field = log.getField("proto")
    const menu = cellMenu(
      "* | group by proto",
      log.descriptor.map((c) => c.name),
      space
    )(field, log)

    expect(menuText(menu)).toMatch(/filter/i)
  })
})
