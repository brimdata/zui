import React from "react"
import {shallow} from "enzyme"
import LogCell from "./LogCell"

test("shapshot", () => {
  const logCell = shallow(<LogCell />)
  expect(logCell).toMatchSnapshot()
})

test("shapshot after right-clicking", () => {
  const logCell = shallow(<LogCell />)
  logCell.simulate("ContextMenu", new Event("ContextMenu"))
  expect(logCell).toMatchSnapshot()
})

test("shapshot after hovering", () => {
  const logCell = shallow(<LogCell />)
  logCell.simulate("MouseEnter", {
    currentTarget: {getBoundingClientRect: () => ({top: 100, left: 100})}
  })
  expect(logCell).toMatchSnapshot()
  logCell.simulate("MouseLeave")
  expect(logCell).toMatchSnapshot()
})

test("shapshot after clicking", () => {
  const logCell = shallow(<LogCell />)
  logCell.simulate("Click", {})
  expect(logCell).toMatchSnapshot()
})
