/* @flow */

import createReducer from "./createReducer"
import get from "lodash/get"
import {uniq} from "../lib/Tuple"
import type {State} from "./types"
import type {Tuple} from "../models/Log"

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
