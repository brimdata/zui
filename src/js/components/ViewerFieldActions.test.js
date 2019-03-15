/* @flow */

import React from "react"

import {shallow} from "enzyme"

import {conn} from "../test/mockLogs"
import ViewerFieldActions from "./ViewerFieldActions"

test("basic snapshot", () => {
  const log = conn()
  const wrapper = shallow(
    <ViewerFieldActions
      actions={[]}
      log={log}
      field={log.getField("_path")}
      onClose={() => {}}
      style={{top: 1, left: 1}}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
