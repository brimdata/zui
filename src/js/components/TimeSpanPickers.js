/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {getNextOuterTimeWindow} from "../state/reducers/timeWindow"
import {setNextOuterTimeWindow} from "../state/span/actions"
import SpanDuration from "./SpanDuration"
import TimePickerButton from "./TimePickerButton"
import TimeSpanMenu from "./TimeSpanMenu"
import search from "../state/search"

export default function TimeSpanPickers() {
  let next = useSelector(getNextOuterTimeWindow)
  let prev = useSelector(search.getSpanAsDates)
  let [from, to] = next || prev
  let dispatch = useDispatch()

  function fromChange(date) {
    dispatch(setNextOuterTimeWindow([date, to]))
  }

  function toChange(date) {
    dispatch(setNextOuterTimeWindow([from, date]))
  }

  return (
    <div className={classNames("time-span-pickers")}>
      <TimePickerButton date={from} onChange={fromChange} />
      <SpanDuration span={[from, to]} />
      <TimePickerButton date={to} onChange={toChange} />
      <TimeSpanMenu />
    </div>
  )
}
