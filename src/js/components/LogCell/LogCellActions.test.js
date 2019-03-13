/* @flow */

import React from "react"
import {shallow} from "enzyme"
import LogCellActions from "./LogCellActions"
import * as mockLogs from "../../test/mockLogs"
import mockSpace from "../../test/mockSpace"

test("basic snapshot", () => {
  const log = mockLogs.conn()
  const space = mockSpace({packet_support: true})
  const wrapper = shallow(
    <LogCellActions
      menuActions={[]}
      resultType="logs"
      dispatch={jest.fn()}
      log={log}
      field={log.getField("_path")}
      space={space}
      onClose={() => {}}
      style={{top: 1, left: 1}}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
