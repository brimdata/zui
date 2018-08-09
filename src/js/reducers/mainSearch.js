import createReducer from "./createReducer"

const initialState = {
  isFetching: false,
  isFetchingPage: true,
  events: []
}

export default createReducer(initialState, {
  MAIN_SEARCH_REQUEST: state => ({...state, isFetching: true, events: []}),
  MAIN_SEARCH_EVENTS: (state, {events}) => ({
    ...state,
    events: [...state.events, ...events]
  }),
  MAIN_SEARCH_COMPLETE: state => ({
    ...state,
    isFetching: false,
    isFetchingPage: false
  }),
  MAIN_SEARCH_PAGE_REQUEST: state => ({...state, isFetchingPage: true})
})
