/* @flow */

import React from "react"

import {shallow} from "enzyme"

import LogCellActions from "./LogCellActions"
import * as mockLogs from "../../test/mockLogs"

test("basic snapshot", () => {
  const log = mockLogs.conn()
  const wrapper = shallow(
    <LogCellActions
      actions={[]}
      log={log}
      field={log.getField("_path")}
      onClose={() => {}}
      style={{top: 1, left: 1}}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
