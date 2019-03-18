/* @flow */

import React from "react"

import {shallow} from "enzyme"

import {conn} from "../test/mockLogs"
import FieldActions from "./FieldActions"

test("basic snapshot", () => {
  const log = conn()
  const wrapper = shallow(
    <FieldActions
      actions={[]}
      log={log}
      field={log.getField("_path")}
      onClose={() => {}}
      style={{top: 1, left: 1}}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
