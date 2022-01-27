import classNames from "classnames"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import Url from "src/js/state/Url"
import Label from "../label"
import ClockIcon from "src/js/icons/ClockIcon"
import {default as Tab, default as tab} from "src/js/state/Tab"
import SpanDuration from "./span-duration"
import SpanPicker from "./span-picker"
import TimeButton from "./time-button"

export const SPAN_TIME_FMT = "MMM DD, YYYY HH:mm:ss"

type Props = {
  submit: Function
}

const SpanControls = ({submit}: Props) => {
  const dispatch = useDispatch()
  const args = useSelector(Tab.getSpanArgs)
  const prev = useSelector(Url.getSpanParamsWithDefaults)
  const [from, to] = args

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
      <SpanPicker submit={submit} />
    </div>
  )
}

export default SpanControls
