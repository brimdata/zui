/* @flow */

import {isEmpty} from "lodash"

import type {Thunk} from "../state/types"
import {uidCorrelation} from "../searches/programs"
import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import Tab from "../state/Tab"
import brim from "../brim"
import executeSearch from "./executeSearch"

export default (log: Log): Thunk => (dispatch, getState) => {
  let uid = log.correlationId()
  if (isEmpty(uid)) return

  let state = getState()
  let span = Tab.getSpanAsDates(state)
  let space = Tab.spaceName(state)
  let program = uidCorrelation(uid)
  let results = []

  const onStatus = (uidStatus) => dispatch(LogDetails.update({uidStatus}))
  const onResults = (records) => {
    results = results.concat(records)
    dispatch(LogDetails.update({uidLogs: results}))
  }

  return dispatch(
    executeSearch(
      brim
        .search(program, span, space)
        .id("UidTimeline")
        .status(onStatus)
        .chan(0, onResults)
    )
  )
}
