/* @flow */

import type {Tuple} from "../types"
import {getSearchProgram} from "../selectors/searchBar"
import {getStarredLogs} from "../reducers/starredLogs"
import {pushSearchHistory} from "./searchHistory"
import {updateTab} from "../actions/view"
import {validateProgram} from "./searchBar"
import BoomClient from "../BoomClient"
import * as SearchFactory from "../lib/SearchFactory"
import serially from "../lib/serially"

type Options = {
  saveToHistory: boolean
}

export const fetchMainSearch = ({saveToHistory = true}: Options = {}) => (
  dispatch: Function,
  getState: Function,
  boom: BoomClient
) => {
  const state = getState()
  if (!dispatch(validateProgram())) return
  dispatch(updateTab(state))
  if (saveToHistory) dispatch(pushSearchHistory())
  if (starredSearch(state)) return showStarred(state, dispatch)

  fetch(dispatch, state, boom)
}

const fetch = serially(
  (...args) => SearchFactory.create(...args).send(),
  search => search.abort()
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

export function mainSearchEvents(events: Tuple[] = []) {
  return {
    type: "MAIN_SEARCH_EVENTS",
    events
  }
}

export function spliceMainSearchEvents(index: number) {
  return {
    type: "MAIN_SEARCH_EVENTS_SPLICE",
    index
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

export const clearMainSearch = () => ({
  type: "MAIN_SEARCH_CLEAR"
})
