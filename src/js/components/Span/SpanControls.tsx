import React from "react"
import classNames from "classnames"
import {useDispatch, useSelector} from "react-redux"
import Label from "../../../../app/toolbar/label"
import ClockIcon from "../../icons/ClockIcon"
import {default as Tab, default as tab} from "../../state/Tab"
import SpanDuration from "./SpanDuration"
import SpanPicker from "./SpanPicker"
import TimeButton from "./TimeButton"
import Current from "src/js/state/Current"

export const SPAN_TIME_FMT = "MMM DD, YYYY HH:mm:ss"

type Props = {
  submit: Function
}

export default function SpanControls(props: Props) {
  const pool = useSelector(Current.getPool)
  const args = useSelector(Tab.getSpanArgs)
  if (args && pool.hasSpan()) {
    return <Controls {...props} args={args} />
  } else {
    return null
  }
}

function Controls({submit, args}) {
  const dispatch = useDispatch()
  const prev = useSelector(Tab.getSpan)
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
