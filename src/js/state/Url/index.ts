import {createAction, createReducer} from "@reduxjs/toolkit"
import * as selectors from "./selectors"

/**
 * We've got to dispatch the url changed event because useSelector
 * subscriptions don't fire if the redux state object does not change.
 * When we push to the url and don't change any state, some subscriptions
 * will not fire.
 */
export const changed = createAction("URL_CHANGED")

const initialState = {num: 0}

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(changed, (state) => {
    state.num += 1
  })
})

export default {...selectors, reducer, changed}
