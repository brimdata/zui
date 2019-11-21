/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import SpanDuration from "./SpanDuration"
import SpanPicker from "./SpanPicker"
import TimeButton from "./TimeButton"
import search from "../../state/search"

export const SPAN_TIME_FMT = "MMM DD, YYYY HH:mm:ss"

export default function SpanControls() {
  let [from, to] = useSelector(search.getSpanArgs)
  let prev = useSelector(search.getPrevSpanArgs)
  let dispatch = useDispatch()

  function fromChange(arg) {
    dispatch(search.setFrom(arg))
  }

  function toChange(arg) {
    dispatch(search.setTo(arg))
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
