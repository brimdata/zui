/* @flow */

import React from "react"

import {shallow} from "enzyme"

import {conn} from "../test/mockLogs"
import LogRow from "./LogRow"
import TableColumns from "../models/TableColumns"

let props
beforeEach(() => {
  const log = conn()
  props = {
    columns: new TableColumns("1", log.descriptor, {
      "1": {isVisible: true}
    }),
    dimens: {
      rowHeight: 25,
      rowWidth: 300,
      viewHeight: 1000,
      viewWidth: 1000,
      listHeight: 20000,
      listWidth: 10000
    },
    highlight: false,
    index: 1,
    log: log,
    timeZone: "UTC",
    timeFormat: "",
    onClick: () => {},
    onDoubleClick: () => {},
    rightClick: () => []
  }
})

test("Rendering the row works", () => {
  shallow(<LogRow {...props} />)
})
