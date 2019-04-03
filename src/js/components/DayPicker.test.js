/* @flow */
import React from "react"
import {shallow} from "enzyme"
import DayPicker from "./DayPicker"

test("rendering DayPicker", () => {
  const props = {
    onDayChange: jest.fn(),
    from: new Date(),
    to: new Date(),
    day: new Date()
  }
  shallow(<DayPicker {...props} />)
})
