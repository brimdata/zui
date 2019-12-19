/* @flow */
import type {Thunk} from "../state/types"
import tabs from "../state/tabs"

const newTab = (): Thunk => (dispatch, getState) => {
  let {search} = tabs.getActiveTab(getState())
  dispatch(tabs.add(search))
  dispatch(tabs.activate(-1))
}

export default newTab
