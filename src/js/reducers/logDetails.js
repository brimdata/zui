/* @flow */

import createReducer from "./createReducer"
import History from "../models/History"
import type {State} from "./types"

export const initialState = {
  logs: [],
  position: 0,
  prevPosition: -1
}

export type LogDetails = typeof initialState

export default createReducer(initialState, {
  LOG_DETAIL_PUSH: (state, {tuple, descriptor}) => {
    const history = toHistory(state)
    history.save({tuple, descriptor})
    return {
      logs: history.entries,
      position: history.position,
      prevPosition: state.position
    }
  },
  LOG_DETAIL_BACK: state => {
    const history = toHistory(state)
    history.goBack()
    return {
      logs: history.entries,
      position: history.position,
      prevPosition: state.position
    }
  },
  LOG_DETAIL_FORWARD: state => {
    const history = toHistory(state)
    history.goForward()
    return {
      logs: history.entries,
      position: history.position,
      prevPosition: state.position
    }
  }
})

export const getLogDetails = (state: State) => {
  return state.logDetails
}

export const getPosition = (state: State) => {
  return state.logDetails.position
}

export const getPrevPosition = (state: State) => {
  return state.logDetails.prevPosition
}

export const toHistory = ({logs, position}: LogDetails) => {
  return new History(logs, position)
}

export const toState = ({entries, position}: History) => {
  return {logs: entries, position}
}
