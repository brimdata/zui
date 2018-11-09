/* @flow */

import buildMenu from "./buildMenu"
import * as mockLogs from "../../test/mockLogs"
import mockSpace from "../../test/mockSpace"

test("conn log with pcap support", () => {
  const log = mockLogs.conn()
  const dispatch = jest.fn()
  const field = log.getField("id.orig_h")
  const space = mockSpace()
  const menu = buildMenu({log, dispatch, field, space})

  expect(menu).toMatchSnapshot()
})

test("dns log", () => {
  const log = mockLogs.dns()
  const dispatch = jest.fn()
  const field = log.getField("query")
  const space = mockSpace()
  const menu = buildMenu({log, dispatch, field, space})

  expect(menu).toMatchSnapshot()
})

test("time field for weird log", () => {
  const log = mockLogs.weird()
  const dispatch = jest.fn()
  const field = log.getField("ts")
  const space = mockSpace()
  const menu = buildMenu({log, dispatch, field, space})

  expect(menu).toMatchSnapshot()
})

test("time field for conn log", () => {
  const log = mockLogs.conn()
  const dispatch = jest.fn()
  const field = log.getField("ts")
  const space = mockSpace()
  const menu = buildMenu({log, dispatch, field, space})

  expect(menu).toMatchSnapshot()
})
