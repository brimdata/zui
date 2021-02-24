import brim from "../brim"
import ErrorFactory from "../models/ErrorFactory"
import Current from "../state/Current"
import Notice from "../state/Notice"
import Spaces from "../state/Spaces"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

export const initSpace = (spaceId: string): Thunk => (dispatch, getState) => {
  const workspaceId = Current.getWorkspaceId(getState())
  if (!workspaceId) return
  const zealot = dispatch(getZealot())
  return zealot.spaces
    .get(spaceId)
    .then(brim.interop.spacePayloadToSpace)
    .then((data) => {
      dispatch(Spaces.setDetail(workspaceId, data))
    })
    .catch((error) => {
      console.error(error)
      const e = ErrorFactory.create(error)
      if (e.type === "NetworkError") return

      dispatch(Notice.set(ErrorFactory.create(e)))
    })
}
