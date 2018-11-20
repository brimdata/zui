/* @flow */

import React from "react"
import {shallow} from "enzyme"
import LogCell from "./LogCell"
import * as mockLogs from "../test/mockLogs"

const log = mockLogs.conn()

test("shapshot", () => {
  const logCell = shallow(
    <LogCell log={log} field={log.getField("_path")} isScrolling={false} />
  )
  expect(logCell).toMatchSnapshot()
})

test("shapshot after right-clicking", () => {
  const logCell = shallow(
    <LogCell log={log} field={log.getField("_path")} isScrolling={false} />
  )
  logCell.simulate("ContextMenu", new Event("ContextMenu"))
  expect(logCell).toMatchSnapshot()
})

test("shapshot after hovering", () => {
  const logCell = shallow(
    <LogCell log={log} field={log.getField("_path")} isScrolling={false} />
  )
  logCell.simulate("MouseEnter", {
    currentTarget: {getBoundingClientRect: () => ({top: 100, left: 100})}
  })
  expect(logCell).toMatchSnapshot()
  logCell.simulate("MouseLeave")
  expect(logCell).toMatchSnapshot()
})

test("shapshot after clicking", () => {
  const logCell = shallow(
    <LogCell log={log} field={log.getField("_path")} isScrolling={false} />
  )
  logCell.simulate("Click", {})
  expect(logCell).toMatchSnapshot()
})

test("shapshot right clicking a time cell", () => {
  const logCell = shallow(
    <LogCell log={log} field={log.getField("ts")} isScrolling={false} />
  )
  logCell.simulate("ContextMenu", new Event("ContextMenu"))
  expect(logCell).toMatchSnapshot()
})
