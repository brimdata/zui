import createReducer from "./createReducer"

const initialState = {
  isFetching: false,
  tuples: [],
  error: null
}

export default createReducer(initialState, {
  LOGS_REQUEST: state => ({
    ...state,
    isFetching: true,
    tuples: [],
    error: null
  }),

  LOGS_RECEIVE: (state, {tuples}) => ({
    ...state,
    tuples: [...state.tuples, ...tuples]
  }),

  LOGS_ERROR: (state, {error}) => ({
    ...state,
    isFetching: false,
    error
  }),

  LOGS_SUCCESS: state => ({
    ...state,
    isFetching: false
  })
})

export const getLogsIsFetching = state => state.logs.isFetching
export const getLogTuples = state => state.logs.tuples
export const getLogsError = state => state.logs.error
