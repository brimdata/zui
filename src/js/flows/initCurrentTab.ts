import Current from "../state/Current"
import {Thunk} from "../state/types"
import {updateStatus} from "./lake/update-status"

export const initCurrentTab = (): Thunk => async (dispatch, getState) => {
  const state = getState()
  const l = Current.getLake(state)
  try {
    await dispatch(updateStatus(l.id))
  } catch (e) {
    console.error("Lake connection failed: ", e)
  }
}
