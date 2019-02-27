/* @flow */

import {PER_PAGE} from "../reducers/logViewer"
import type {State, Dispatch, Api} from "../reducers/types"
import {getCountByTimeProc} from "../reducers/mainSearch"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"
import {getSearchProgram} from "../selectors/searchBar"
import * as Program from "../lib/Program"
import Search from "../models/Search"
import analyticsReceiver from "../receivers/analyticsReceiver"
import countByTimeReceiver from "../receivers/countByTimeReceiver"
import logsReceiver from "../receivers/logsReceiver"
import pageReceiver from "../receivers/pageReceiver"

export const create = (dispatch: Dispatch, state: State, boom: Api) => {
  return new Search(dispatch, boom, getArgs(dispatch, state))
}

export const getType = (state: State) => {
  if (Program.hasAnalytics(getSearchProgram(state))) {
    return "ANALYTICS"
  } else if (getInnerTimeWindow(state)) {
    return "LOGS_SUBSET"
  } else if (Program.hasHeadOrTailProc(getSearchProgram(state))) {
    return "LOGS_HEAD"
  } else {
    return "LOGS_PAGED"
  }
}

export const getArgs = (dispatch: Dispatch, state: State) => {
  switch (getType(state)) {
    case "ANALYTICS":
      return analyticsArgs(dispatch, state)
    case "LOGS_SUBSET":
      return logsSubsetArgs(dispatch, state)
    case "LOGS_HEAD":
      return logsHeadArgs(dispatch, state)
    case "LOGS_PAGED":
      return logsPagedArgs(dispatch, state)
    default:
      throw new Error("Unknown search type")
  }
}

export const analyticsArgs = (dispatch: Dispatch, state: State) => {
  return {
    space: getCurrentSpaceName(state),
    program: getSearchProgram(state),
    timeWindow: getTimeWindow(state),
    callbacks: (request: *) =>
      request.channel(0, analyticsReceiver(dispatch, 0))
  }
}

export const logsSubsetArgs = (dispatch: Dispatch, state: State) => {
  const program =
    Program.addHeadProc(getSearchProgram(state), PER_PAGE) + "; count()"

  return {
    space: getCurrentSpaceName(state),
    program,
    timeWindow: getInnerTimeWindow(state),
    callbacks: (request: *) =>
      request
        .channel(1, pageReceiver(dispatch, PER_PAGE))
        .channel(1, logsReceiver(dispatch))
  }
}

export const logsHeadArgs = (dispatch: Dispatch, state: State) => {
  const program = getSearchProgram(state) + "; " + getCountByTimeProc(state)
  return {
    space: getCurrentSpaceName(state),
    program,
    timeWindow: getTimeWindow(state),
    callbacks: (request: *) =>
      request
        .channel(1, logsReceiver(dispatch))
        .channel(0, countByTimeReceiver(dispatch))
  }
}

export const logsPagedArgs = (dispatch: Dispatch, state: State) => {
  const program =
    Program.addHeadProc(getSearchProgram(state), PER_PAGE) +
    "; " +
    getCountByTimeProc(state)

  return {
    space: getCurrentSpaceName(state),
    program,
    timeWindow: getTimeWindow(state),
    callbacks: (request: *) =>
      request
        .channel(1, pageReceiver(dispatch, PER_PAGE))
        .channel(1, logsReceiver(dispatch))
        .channel(0, countByTimeReceiver(dispatch))
  }
}
