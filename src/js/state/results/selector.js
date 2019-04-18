/* @flow */
import type {State} from "../reducers/types"

export function getResultLogs(state: State) {
  return state.results.logs
}

export function getResultsCompletion(state: State) {
  return state.results.completion
}

export function getResultsAreComplete(state: State) {
  return getResultsCompletion(state) === "COMPLETE"
}

export function getResultsAreIncomplete(state: State) {
  return getResultsCompletion(state) === "INCOMPLETE"
}

export function getResultsAreLimitted(state: State) {
  return getResultsCompletion(state) === "LIMIT"
}
