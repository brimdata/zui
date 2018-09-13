import React from "react"
import {shallow} from "enzyme"
import CountByTime from "./CountByTime"

test("onDrag redraws with a shifted time zone", () => {
  const wrapper = shallow(
    <CountByTime
      width={100}
      height={80}
      data={[]}
      keys={[]}
      timeWindow={[new Date(2018, 0), new Date(2018, 1)]}
    />
  )
  const instance = wrapper.instance()
  instance.draw = jest.fn()
  instance.onDrag(45, 100)
  expect(instance.draw).toBeCalledWith([
    new Date("2018-01-18T09:12:00.000Z"),
    new Date("2018-02-18T09:12:00.000Z")
  ])

  instance.draw = jest.fn()
  instance.onDrag(45, 0)
  expect(instance.draw).toBeCalledWith([
    new Date("2017-12-18T09:12:00.000Z"),
    new Date("2018-01-18T09:12:00.000Z")
  ])
})

test("onDragEnd dispatches setOuterTimeWindow", () => {
  const setOuterTimeWindow = jest.fn()
  const fetchMainSearch = jest.fn()
  const wrapper = shallow(
    <CountByTime
      width={100}
      height={80}
      data={[]}
      keys={[]}
      timeWindow={[new Date(2018, 0), new Date(2018, 1)]}
      setOuterTimeWindow={setOuterTimeWindow}
      fetchMainSearch={fetchMainSearch}
    />
  )
  const instance = wrapper.instance()
  instance.onDragEnd(45, 100)
  expect(setOuterTimeWindow).toBeCalledWith([
    new Date("2018-01-18T09:12:00.000Z"),
    new Date("2018-02-18T09:12:00.000Z")
  ])
  expect(fetchMainSearch).toBeCalled()
})
