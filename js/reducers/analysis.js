import createReducer from "./createReducer"

const initialState = {}

export default createReducer(initialState, {
  MAIN_SEARCH_REQUEST: () => ({}),
  ANALYSIS_SET: (state, {id, descriptor, tuples}) => {
    return {
      ...state,
      [id]: {
        descriptor,
        tuples: mergeTuples(state, id, tuples)
      }
    }
  }
})

const mergeTuples = (state, id, tuples) => {
  if (state[id]) {
    return [...state[id].tuples, ...tuples]
  } else {
    return tuples
  }
}
