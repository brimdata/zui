import {useDispatch, useSelector} from "react-redux"

import {DateTuple, spanOfLast} from "../lib/TimeWindow"
import Current from "../state/Current"
import Search from "../state/Search"
import brim from "../brim"
import {SpanArgs} from "../state/Search/types"

export default function useSpanPickerMenu(submit: Function) {
  const dispatch = useDispatch()
  const pool = useSelector(Current.mustGetPool)

  function setSpan(span: DateTuple) {
    dispatch(Search.setSpanArgsFromDates(span))
    submit()
  }

  const setSpanFromTs = (span: SpanArgs) => {
    dispatch(Search.setSpanArgs(span))
    submit()
  }

  if (!pool)
    return [
      {
        click: () => setSpan(spanOfLast(30, "minutes")),
        label: "Last 30 minutes",
      },
      {click: () => setSpan(spanOfLast(24, "hours")), label: "Last 24 hours"},
      {click: () => setSpan(spanOfLast(7, "days")), label: "Last 7 days"},
      {click: () => setSpan(spanOfLast(30, "days")), label: "Last 30 days"},
    ]

  const from = brim.time(pool.minTime())
  const to = brim.time(pool.maxTime()).add(1, "ms")
  const poolSpan: SpanArgs = [from.toTs(), to.toTs()]

  return [
    {click: () => setSpanFromTs(poolSpan), label: "Whole Pool"},
    {
      click: () => setSpan(spanOfLast(30, "minutes", to.toDate())),
      label: "Last 30 minutes of pool",
    },
    {
      click: () => setSpan(spanOfLast(24, "hours", to.toDate())),
      label: "Last 24 hours of pool",
    },
    {
      click: () => setSpan(spanOfLast(7, "days", to.toDate())),
      label: "Last 7 days of pool",
    },
    {
      click: () => setSpan(spanOfLast(30, "days", to.toDate())),
      label: "Last 30 days of pool",
    },
  ]
}
