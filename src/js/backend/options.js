/* @flow */
import type {Thunk} from "../state/reducers/types"
import {getBoomOptions} from "../state/selectors/boom"

export const updateBoomOptions = (): Thunk => (dispatch, getState, boom) => {
  boom.setOptions(getBoomOptions(getState()))
}
