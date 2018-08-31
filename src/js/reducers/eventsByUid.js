import createReducer from "./createReducer"
import get from "lodash/get"
import {uniq} from "../lib/Tuple"

const initialState = {}

export default createReducer(initialState, {
  CORRELATED_LOGS_RECEIVE: (state, {uid, tuples}) => ({
    ...state,
    [uid]: uniq(get(state, uid, []).concat(tuples))
  })
})

export const getTuplesByUid = state => state.eventsByUid
