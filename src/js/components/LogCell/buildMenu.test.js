/* @flow */

import {conn, dns, weird} from "../../test/mockLogs"
import buildMenu from "./buildMenu"
import mockSpace from "../../test/mockSpace"

describe("Log Right Click", () => {
  const resultType = "logs"

  test("conn log with pcap support", () => {
    const log = conn()
    const dispatch = jest.fn()
    const field = log.getField("id.orig_h")
    const space = mockSpace()
    const menu = buildMenu({log, dispatch, field, space, resultType})

    expect(menu).toMatchSnapshot()
  })

  test("dns log", () => {
    const log = dns()
    const dispatch = jest.fn()
    const field = log.getField("query")
    const space = mockSpace()
    const menu = buildMenu({log, dispatch, field, space, resultType})

    expect(menu).toMatchSnapshot()
  })

  test("time field for weird log", () => {
    const log = weird()
    const dispatch = jest.fn()
    const field = log.getField("ts")
    const space = mockSpace()
    const menu = buildMenu({log, dispatch, field, space, resultType})

    expect(menu).toMatchSnapshot()
  })

  test("time field for conn log", () => {
    const log = conn()
    const dispatch = jest.fn()
    const field = log.getField("ts")
    const space = mockSpace()
    const menu = buildMenu({log, dispatch, field, space, resultType})

    expect(menu).toMatchSnapshot()
  })
})
