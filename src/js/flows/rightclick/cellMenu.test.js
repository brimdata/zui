/* @flow */

import type {MenuItem} from "electron"

import {conn, dns, weird} from "../../test/mockLogs"
import menu from "../../electron/menu"

function menuText(menu: MenuItem) {
  return menu
    .filter((item) => item.enabled)
    .map((item) => item.label)
    .join(", ")
}

describe("Log Right Click", () => {
  const space = {
    name: "default",
    min_time: {sec: 1425564900, ns: 0},
    max_time: {sec: 1428917793, ns: 750000000},
    packet_support: true,
    ingest_progress: null
  }
  const program = "*"

  test("conn log with pcap support", () => {
    const log = conn()
    const field = log.mustGetField("id.orig_h")
    const ctxMenu = menu.fieldContextMenu(
      program,
      log.descriptor.map((c) => c.name),
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).toMatch(/pcaps/i)
  })

  test("conn log without pcap support", () => {
    space.packet_support = false

    const log = conn()
    const field = log.mustGetField("id.orig_h")
    const ctxMenu = menu.fieldContextMenu(
      program,
      log.descriptor.map((c) => c.name),
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).not.toMatch(/pcaps/i)
  })

  test("dns log", () => {
    const log = dns()
    const field = log.mustGetField("query")
    const ctxMenu = menu.fieldContextMenu(
      program,
      log.descriptor.map((c) => c.name),
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).toMatch(/virustotal/i)
    expect(menuText(ctxMenu)).toMatch(/count by/i)
  })

  test("time field for weird log", () => {
    const log = weird()
    const field = log.mustGetField("ts")
    const ctxMenu = menu.fieldContextMenu(
      program,
      log.descriptor.map((c) => c.name),
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).toMatch(/"start" time/i)
    expect(menuText(ctxMenu)).toMatch(/"end" time/i)
  })

  test("time field for conn log", () => {
    const log = conn()
    const field = log.mustGetField("ts")
    const ctxMenu = menu.fieldContextMenu(
      program,
      log.descriptor.map((c) => c.name),
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).toMatch(/"start" time/i)
    expect(menuText(ctxMenu)).toMatch(/"end" time/i)
  })
})

describe("Analysis Right Click", () => {
  const program = "* | count() by id.orig_h"
  const space = {
    name: "default",
    min_time: {sec: 1425564900, ns: 0},
    max_time: {sec: 1428917793, ns: 750000000},
    packet_support: true,
    ingest_progress: null
  }

  test("address field", () => {
    const log = conn()
    const field = log.mustGetField("id.orig_h")
    const ctxMenu = menu.fieldContextMenu(
      program,
      log.descriptor.map((c) => c.name),
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).toMatch(/whois/i)
  })

  test("non-address field", () => {
    const log = conn()
    const field = log.mustGetField("proto")
    const ctxMenu = menu.fieldContextMenu(
      "* | count() by proto",
      log.descriptor.map((c) => c.name),
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).toMatch(/pivot/i)
  })

  test("group by proc", () => {
    const log = conn()
    const field = log.mustGetField("proto")
    const ctxMenu = menu.fieldContextMenu(
      "* | group by proto",
      log.descriptor.map((c) => c.name),
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).toMatch(/filter/i)
  })
})
