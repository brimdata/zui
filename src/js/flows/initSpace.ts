import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Spaces from "../state/Spaces"
import brim from "../brim"
import ErrorFactory from "../models/ErrorFactory"
import Notice from "../state/Notice"

export const initSpace = (spaceId: string): Thunk => (dispatch, getState) => {
  const workspaceId = Current.getWorkspaceId(getState())
  if (!workspaceId) return
  const zealot = dispatch(getZealot())
  return zealot.spaces
    .get(spaceId)
    .then(brim.interop.spacePayloadToSpace)
    .then((data) => {
      const space = brim.space(data)
      dispatch(Spaces.setDetail(workspaceId, data))
      dispatch(Search.setSpanArgs(space.everythingSpan()))
      dispatch(SearchBar.removeAllSearchBarPins())
      dispatch(SearchBar.changeSearchBarInput(""))
    })
    .catch((error) => {
      console.error(error)
      const e = ErrorFactory.create(error)
      if (e.type === "NetworkError") return

      dispatch(Notice.set(ErrorFactory.create(e)))
    })
}
