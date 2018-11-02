/* @flow */

import serially from "../lib/serially"
import {pushSearchHistory} from "./searchHistory"
import {updateTab} from "../actions/view"
import {getStarredLogs} from "../reducers/starredLogs"
import {getSearchProgram} from "../reducers/searchBar"
import {validateProgram} from "./searchBar"
import Client from "boom-js-client"
import * as SearchFactory from "../lib/SearchFactory"

type Options = {
  saveToHistory: boolean
}

export const fetchMainSearch = ({saveToHistory = true}: Options = {}) => (
  dispatch: Function,
  getState: Function,
  api: Client
) => {
  const state = getState()
  if (!dispatch(validateProgram())) return
  dispatch(updateTab(state))
  if (saveToHistory) dispatch(pushSearchHistory())
  if (starredSearch(state)) return showStarred(state, dispatch)
  fetch(dispatch, state, api)
}

const fetch = serially(
  (...args) => SearchFactory.create(...args).send(),
  search => search.abortRequest()
)

const starredSearch = state => {
  return getSearchProgram(state) === ":starred"
}

const showStarred = serially(
  (state, dispatch) => {
    const starredLogs = getStarredLogs(state)
    dispatch(requestMainSearch())
    return setTimeout(() => {
      dispatch(mainSearchEvents([...starredLogs]))
      dispatch(completeMainSearch())
    })
  },
  id => clearTimeout(id)
)

export function requestMainSearch() {
  return {
    type: "MAIN_SEARCH_REQUEST"
  }
}

export function mainSearchEvents(events: [] = []) {
  return {
    type: "MAIN_SEARCH_EVENTS",
    events
  }
}

export function completeMainSearch() {
  return {
    type: "MAIN_SEARCH_COMPLETE"
  }
}

export function appendMainSearchQueryProgram(fragment: string) {
  return {
    type: "MAIN_SEARCH_QUERY_PROGRAM_APPEND",
    fragment
  }
}
