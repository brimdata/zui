import {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import rpc from "../electron/rpc"
import {getZealot} from "./getZealot"
import Current from "../state/Current"

export default (): Thunk<Promise<any[]>> => (dispatch, getState) => {
  const current = Current.getWorkspace(getState())
  if (!current) return

  const zealot = dispatch(getZealot())
  const spaceIds = Handlers.getIngestSpaceIds(getState())

  // if current space id is among ingesting spaces, clear it
  const currentSpaceId = Current.getSpaceId(getState())
  if (spaceIds.includes(currentSpaceId)) dispatch(Current.setSpaceId(null))

  return Promise.all(
    spaceIds.map((id) => {
      return zealot.spaces.delete(id).catch((e) => {
        rpc.log(`Unable to delete space: ${id}, reason: ${JSON.stringify(e)}`)
      })
    })
  )
}
