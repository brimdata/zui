/* @flow */

import get from "lodash/get"

import type {State} from "./types"
import type {Tuple} from "../types"
import {uniq} from "../lib/Tuple"
import createReducer from "./createReducer"

const initialState = {}

export type TuplesByUid = {[string]: Tuple[]}

export default createReducer(initialState, {
  TUPLES_BY_UID_CLEAR: () => ({
    ...initialState
  }),
  TUPLES_BY_UID_ADD: (state, {uid, tuples}) => ({
    ...state,
    [uid]: uniq(get(state, uid, []).concat(tuples))
  })
})

export const getTuplesByUid = (state: State) => {
  return state.tuplesByUid
}
