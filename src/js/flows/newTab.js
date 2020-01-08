/* @flow */
import type {Thunk} from "../state/types"
import brim from "../brim"
import tabs from "../state/tabs"

const newTab = (): Thunk => (dispatch, getState) => {
  let {search} = tabs.getActiveTab(getState())
  let id = brim.randomHash()

  dispatch(tabs.add(id, search))
  dispatch(tabs.activate(id))
  focusSearchInput()
}

function focusSearchInput() {
  let el = document.getElementById("main-search-input")
  if (el) el.focus()
}

export default newTab
