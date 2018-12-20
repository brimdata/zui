/* @flow */

import {getSearchProgram} from "../reducers/searchBar"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"
import analyticsReceiver from "../receivers/analyticsReceiver"
import logsReceiver from "../receivers/logsReceiver"
import countByTimeReceiver from "../receivers/countByTimeReceiver"
import {getCountByTimeProc} from "../reducers/mainSearch"
import * as Program from "../lib/Program"
import Search from "../models/Search"
import {getCurrentSpaceName} from "../reducers/spaces"
import type {State, Dispatch, Api} from "../reducers/types"
import pageReceiver from "../receivers/pageReceiver"
import {completeMainSearch} from "../actions/mainSearch"

export const create = (dispatch: Dispatch, state: State, api: Api) => {
  return new Search(dispatch, api, getArgs(dispatch, state))
}

export const getType = (state: State) => {
  if (Program.hasAnalytics(getSearchProgram(state))) {
    return "ANALYTICS"
  } else if (getInnerTimeWindow(state)) {
    return "LOGS_SUBSET"
  } else if (Program.hasHeadProc(getSearchProgram(state))) {
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
    Program.addHeadProc(getSearchProgram(state), 200) + "; count()"

  return {
    space: getCurrentSpaceName(state),
    program,
    timeWindow: getInnerTimeWindow(state),
    callbacks: (request: *) =>
      request
        .channel(1, pageReceiver(dispatch, 200))
        .channel(1, logsReceiver(dispatch))
        .done(() => {
          dispatch(completeMainSearch())
        })
  }
}

export const logsHeadArgs = (dispatch: Dispatch, state: State) => {
  const program =
    Program.addHeadProc(getSearchProgram(state), 200) +
    "; " +
    getCountByTimeProc(state)
  return {
    space: getCurrentSpaceName(state),
    program,
    timeWindow: getTimeWindow(state),
    callbacks: (request: *) =>
      request
        .channel(1, logsReceiver(dispatch))
        .channel(0, countByTimeReceiver(dispatch))
        .done(() => {
          console.log("hi")
          dispatch(completeMainSearch())
        })
  }
}

export const logsPagedArgs = (dispatch: Dispatch, state: State) => {
  const PER_PAGE = 200
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
        .done(() => {
          dispatch(completeMainSearch())
        })
  }
}
