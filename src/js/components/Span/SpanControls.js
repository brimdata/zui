/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import SpanDuration from "./SpanDuration"
import SpanPicker from "./SpanPicker"
import TimeButton from "./TimeButton"
import search from "../../state/search"

export default function SpanControls() {
  let [from, to] = useSelector(search.getSpanArgs)
  let dispatch = useDispatch()

  function fromChange(arg) {
    dispatch(search.setFrom(arg))
  }

  function toChange(arg) {
    dispatch(search.setTo(arg))
  }

  return (
    <div className={classNames("time-span-pickers")}>
      <TimeButton timeArg={from} onChange={fromChange} />
      <SpanDuration spanArgs={[from, to]} />
      <TimeButton timeArg={to} onChange={toChange} />
      <SpanPicker />
    </div>
  )
}
