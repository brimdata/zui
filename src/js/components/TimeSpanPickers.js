/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {getTimeWindow} from "../state/reducers/timeWindow"
import {setOuterTimeWindow} from "../state/actions"
import SpanDuration from "./SpanDuration"
import TimePickerButton from "./TimePickerButton"
import TimeSpanMenu from "./TimeSpanMenu"

export default function TimeSpanPickers() {
  let [from, to] = useSelector(getTimeWindow)
  let dispatch = useDispatch()

  function fromChange(date) {
    dispatch(setOuterTimeWindow([date, to]))
  }

  function toChange(date) {
    dispatch(setOuterTimeWindow([from, date]))
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
