/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import classNames from "classnames"

import SpanDuration from "./SpanDuration"
import SpanPicker from "./SpanPicker"
import TimeButton from "./TimeButton"
import tab from "../../state/Tab"

export const SPAN_TIME_FMT = "MMM DD, YYYY HH:mm:ss"

export default function SpanControls() {
  let [from, to] = useSelector(tab.getSpanArgs)
  let entry = useSelector(tab.currentEntry)
  let [prev, setPrev] = useState()

  useEffect(() => {
    setPrev(entry && entry.spanArgs)
  }, [entry])

  let dispatch = useDispatch()

  function fromChange(arg) {
    dispatch(tab.setFrom(arg))
  }

  function toChange(arg) {
    dispatch(tab.setTo(arg))
  }

  return (
    <div className={classNames("time-span-pickers")}>
      <TimeButton
        timeArg={from}
        prevTimeArg={prev && prev[0]}
        onChange={fromChange}
      />
      <SpanDuration spanArgs={[from, to]} />
      <TimeButton
        timeArg={to}
        prevTimeArg={prev && prev[1]}
        onChange={toChange}
      />
      <SpanPicker />
    </div>
  )
}
