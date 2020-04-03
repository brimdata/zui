/* @flow */

import {createSelector} from "reselect"

import type {State} from "../types"
import {toHistory} from "./reducer"
import Log from "../../models/Log"
import activeTabSelect from "../Tab/activeTabSelect"
import type {TabState} from "../Tab/types"

const getLogDetails = activeTabSelect((state: TabState) => {
  return state.logDetails
})

const getPosition = activeTabSelect((state: TabState) => {
  return state.logDetails.position
})

const getPrevPosition = activeTabSelect((state: TabState) => {
  return state.logDetails.prevPosition
})

const getHistory = createSelector<State, void, *, *>(
  getLogDetails,
  (logDetails) => toHistory(logDetails)
)

const getPrevExists = createSelector<State, void, *, *>(getHistory, (history) =>
  history.prevExists()
)

const getNextExists = createSelector<State, void, *, *>(getHistory, (history) =>
  history.nextExists()
)

const getIsGoingBack = createSelector<State, void, *, *, *>(
  getPosition,
  getPrevPosition,
  (position, prevPosition) => prevPosition - position < 0
)

const build = createSelector<State, void, *, *>(getHistory, (history) => {
  const log = history.getCurrent()
  return log ? new Log(log.tuple, log.descriptor) : null
})

export default {
  getLogDetails,
  getPosition,
  getPrevPosition,
  build,
  getIsGoingBack,
  getNextExists,
  getPrevExists,
  getHistory
}
