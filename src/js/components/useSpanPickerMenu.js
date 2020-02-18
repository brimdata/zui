/* @flow */

import {useDispatch, useSelector} from "react-redux"

import {type DateTuple, spanOfLast} from "../lib/TimeWindow"
import Search from "../state/Search"
import Tab from "../state/Tab"
import brim from "../brim"
import submitSearch from "../flows/submitSearch"

export default function useSpanPickerMenu() {
  let dispatch = useDispatch()
  let space = useSelector(Tab.space)

  function setSpan(span: DateTuple) {
    dispatch(Search.setSpanArgsFromDates(span))
    dispatch(submitSearch())
  }

  let menu = [
    {click: () => setSpan(spanOfLast(30, "minutes")), label: "Last 30 minutes"},
    {click: () => setSpan(spanOfLast(24, "hours")), label: "Last 24 hours"},
    {click: () => setSpan(spanOfLast(7, "days")), label: "Last 7 days"},
    {click: () => setSpan(spanOfLast(30, "days")), label: "Last 30 days"},
    {click: () => setSpan(spanOfLast(90, "days")), label: "Last 90 days"}
  ]

  if (!space) return menu
  let {min_time, max_time} = space

  let from = brim.time(min_time).toDate()
  let to = brim
    .time(max_time)
    .add(1, "ms")
    .toDate()
  let spaceSpan = [from, to]

  menu.unshift({click: () => setSpan(spaceSpan), label: "Whole Space"})
  return menu
}
