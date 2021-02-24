import useSearchParams from "app/router/hooks/use-search-params"
import classNames from "classnames"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import Label from "../../../../app/toolbar/label"
import ClockIcon from "../../icons/ClockIcon"
import tab from "../../state/Tab"
import SpanDuration from "./SpanDuration"
import SpanPicker from "./SpanPicker"
import TimeButton from "./TimeButton"

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
