import React from "react"
import {shallow} from "enzyme"
import LogCellActions from "./LogCellActions"
import * as mockLogs from "../test/mockLogs"

test("basic snapshot", () => {
  const log = mockLogs.conn()
  const space = {packet_support: true}
  const wrapper = shallow(
    <LogCellActions
      log={log}
      field={log.getField("_path")}
      space={space}
      onClose={() => {}}
      style={{top: 1, left: 1}}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
