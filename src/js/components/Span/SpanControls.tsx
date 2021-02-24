import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useLayoutEffect} from "react"
import classNames from "classnames"

import ClockIcon from "../../icons/ClockIcon"
import Label from "../../../../app/toolbar/label"
import SpanDuration from "./SpanDuration"
import SpanPicker from "./SpanPicker"
import TimeButton from "./TimeButton"
import tab from "../../state/Tab"
import usePrevious from "../hooks/usePrevious"
import {useLocation} from "react-router"
import useSearchParams from "app/router/hooks/use-search-params"

export const SPAN_TIME_FMT = "MMM DD, YYYY HH:mm:ss"

export default function SpanControls() {
  const dispatch = useDispatch()
  const [from, to] = useSelector(tab.getSpanArgs)
  const {spanArgs: prev} = useSearchParams()

  function fromChange(arg) {
    dispatch(tab.setFrom(arg))
  }

  function toChange(arg) {
    dispatch(tab.setTo(arg))
  }

  return (
    <div className={classNames("time-span-pickers")}>
      <div title="Click to set the start time for the search">
        <TimeButton
          timeArg={from}
          prevTimeArg={prev && prev[0]}
          onChange={fromChange}
          icon={<ClockIcon />}
        />
        <Label>From</Label>
      </div>
      <SpanDuration spanArgs={[from, to]} />
      <div title="Click to set the end time for the search">
        <TimeButton
          timeArg={to}
          prevTimeArg={prev && prev[1]}
          onChange={toChange}
        />
        <Label>To</Label>
      </div>
      <SpanPicker />
    </div>
  )
}
