import createReducer from "./createReducer"
import get from "lodash/get"
import uniqBy from "lodash/uniqBy"

const initialState = {}

export default createReducer(initialState, {
  CORRELATED_LOGS_RECEIVE: (state, {uid, tuples}) => {
    const allTuples = uniqBy(get(state, uid, []).concat(tuples), tsPath)
    return {
      ...state,
      [uid]: allTuples
    }
  }
})

const tsPath = ([_descriptor, path, ts]) => path + ts

export const getTuplesByUid = state => state.eventsByUid
