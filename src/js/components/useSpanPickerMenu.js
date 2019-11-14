/* @flow */

import {useDispatch, useSelector} from "react-redux"

import {type DateTuple, spanOfLast} from "../lib/TimeWindow"
import {getCurrentSpace} from "../state/reducers/spaces"
import {setOuterTimeWindow} from "../state/actions"
import {submitSearchBar} from "../state/thunks/searchBar"
import brim from "../brim"

export default function useSpanPickerMenu() {
  let dispatch = useDispatch()
  let space = useSelector(getCurrentSpace)

  function setSpan(span: DateTuple) {
    dispatch(setOuterTimeWindow(span))
    dispatch(submitSearchBar())
  }

  if (!space) return []
  let {min_time, max_time} = space

  let from = brim.time(min_time).toDate()
  let to = brim
    .time(max_time)
    .add(1, "ms")
    .toDate()

  let spaceSpan = [from, to]

  return [
    {click: () => setSpan(spaceSpan), label: "Whole Space"},
    {click: () => setSpan(spanOfLast(30, "minutes")), label: "Last 30 minutes"},
    {click: () => setSpan(spanOfLast(24, "hours")), label: "Last 24 hours"},
    {click: () => setSpan(spanOfLast(7, "days")), label: "Last 7 days"},
    {click: () => setSpan(spanOfLast(30, "days")), label: "Last 30 days"},
    {click: () => setSpan(spanOfLast(90, "days")), label: "Last 90 days"}
  ]
}
