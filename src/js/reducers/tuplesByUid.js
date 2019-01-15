/* @flow */

import createReducer from "./createReducer"
import get from "lodash/get"
import {uniq} from "../lib/Tuple"
import type {State} from "./types"
import type {Tuple} from "../models/Log"

const initialState = {}

export type TuplesByUid = {[string]: Tuple[]}

export default createReducer(initialState, {
  CORRELATED_LOGS_CLEAR: () => ({
    ...initialState
  }),
  CORRELATED_LOGS_RECEIVE: (state, {uid, tuples}) => ({
    ...state,
    [uid]: uniq(get(state, uid, []).concat(tuples))
  })
})

export const getTuplesByUid = (state: State) => {
  return state.tuplesByUid
}
