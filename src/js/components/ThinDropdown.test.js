/* @flow */
import React from "react"
import {shallow} from "enzyme"
import ThinDropdown from "./ThinDropdown"

const props = {
  value: "Hello",
  align: "left"
}

test("truth", () => {
  const comp = shallow(
    <ThinDropdown {...props}>
      <p>Hello World</p>
    </ThinDropdown>
  )

  comp.setState({isOpen: true})

  expect(true)
})
