/* @flow */

import {isEmpty} from "lodash"

import type {Thunk} from "../state/types"
import {uidCorrelation} from "../searches/programs"
import Current from "../state/Current"
import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import Tab from "../state/Tab"
import brim from "../brim"
import executeSearch from "./executeSearch"

export default (log: Log): Thunk => (dispatch, getState) => {
  if (!log) return
  let uid = log.correlationId()
  if (isEmpty(uid)) return

  let state = getState()
  let span = Tab.getSpanAsDates(state)
  let spaceId = Current.getSpaceId(state)
  let program = uidCorrelation(uid)
  let results = []

  const onStatus = (uidStatus) => dispatch(LogDetails.update({uidStatus}))
  const onResults = (records) => {
    results = results.concat(records)
    dispatch(LogDetails.update({uidLogs: results}))
  }

  if (!spaceId) return
  return dispatch(
    executeSearch(
      brim
        .search(program, span, spaceId)
        .id("UidTimeline")
        .status(onStatus)
        .chan(0, onResults)
    )
  )
}
