import React from "react"
import {shallow} from "enzyme"
import DayPicker from "./DayPicker"

test("rendering DayPicker", () => {
  const onDayChange = jest.fn()
  shallow(<DayPicker onDayChange={onDayChange} />)
})
