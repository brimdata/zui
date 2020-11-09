import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import {globalDispatch} from "../state/GlobalContext"
import {submitSearch} from "./submitSearch/mod"
import Current from "../state/Current"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Spaces from "../state/Spaces"
import brim from "../brim"
import {handleZealotError} from "./handleZealotError"

export const initSpace = (spaceId: string): Thunk => (dispatch, getState) => {
  const clusterId = Current.getConnectionId(getState())
  if (!clusterId) return
  const zealot = dispatch(getZealot())
  return zealot.spaces
    .get(spaceId)
    .then(brim.interop.spacePayloadToSpace)
    .then((data) => {
      const space = brim.space(data)
      globalDispatch(Spaces.setDetail(clusterId, data))
      dispatch(Current.setSpaceId(space.id))
      dispatch(Search.setSpanArgs(space.everythingSpan()))
      dispatch(SearchBar.removeAllSearchBarPins())
      dispatch(SearchBar.changeSearchBarInput(""))
      if (!space.hasIndex()) {
        dispatch(SearchBar.setTarget("events"))
      }
      dispatch(submitSearch({history: true, investigation: false}))
    })
    .catch((error) => {
      dispatch(handleZealotError(error))
    })
}
