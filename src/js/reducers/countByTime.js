import createReducer from "./createReducer"

const initialState = {
  descriptor: [],
  tuples: []
}

export default createReducer(initialState, {
  MAIN_SEARCH_REQUEST: () => ({...initialState}),
  COUNT_BY_TIME_UPDATE: (state, {descriptor, tuples}) => ({
    descriptor,
    tuples: [...state.tuples, ...tuples]
  })
})
