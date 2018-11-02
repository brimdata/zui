/* @flow */

import {getSearchProgram} from "../reducers/searchBar"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"
import analyticsReceiver from "../receivers/analyticsReceiver"
import eventsReceiver from "../receivers/eventsReceiver"
import countByTimeReceiver from "../receivers/countByTimeReceiver"
import {getCountByTimeProc} from "../reducers/mainSearch"
import * as Program from "../lib/Program"
import Search from "../models/Search"
import {getCurrentSpaceName} from "../reducers/spaces"
import type {State, Dispatch, Api} from "../reducers/types"

export const getType = (state: State) => {
  if (Program.hasAnalytics(getSearchProgram(state))) {
    return "ANALYTICS"
  } else if (getInnerTimeWindow(state)) {
    return "LOGS_SUBSET"
  } else {
    return "LOGS"
  }
}

export const create = (dispatch: Dispatch, state: State, api: Api) => {
  switch (getType(state)) {
    case "ANALYTICS":
      return new Search(state, dispatch, api, {
        space: getCurrentSpaceName(state),
        program: getSearchProgram(state),
        timeWindow: getTimeWindow(state),
        callbacks: request => request.channel(0, analyticsReceiver(dispatch, 0))
      })
    case "LOGS_SUBSET":
      return new Search(state, dispatch, api, {
        space: getCurrentSpaceName(state),
        program:
          Program.addHeadProc(getSearchProgram(state), 1000) + "; count()",
        timeWindow: getInnerTimeWindow(state),
        callbacks: request => request.channel(1, eventsReceiver(dispatch))
      })
    case "LOGS":
      return new Search(state, dispatch, api, {
        space: getCurrentSpaceName(state),
        program:
          Program.addHeadProc(getSearchProgram(state), 1000) +
          "; " +
          getCountByTimeProc(state),
        timeWindow: getTimeWindow(state),
        callbacks: request =>
          request
            .channel(1, eventsReceiver(dispatch))
            .channel(0, countByTimeReceiver(dispatch))
      })
  }
  throw new Error("Unknown search type")
}
