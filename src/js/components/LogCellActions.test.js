import React from "react"
import {shallow} from "enzyme"
import LogCellActions from "./LogCellActions"
import Field from "../models/Field"

test("basic snapshot", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  const wrapper = shallow(
    <LogCellActions
      field={field}
      onClose={() => {}}
      style={{top: 1, left: 1}}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
