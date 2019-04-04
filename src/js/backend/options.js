/* @flow */
import type {Thunk} from "../reducers/types"
import {getBoomOptions} from "../selectors/boom"

export const updateBoomOptions = (): Thunk => (dispatch, getState, boom) => {
  boom.setOptions(getBoomOptions(getState()))
}
