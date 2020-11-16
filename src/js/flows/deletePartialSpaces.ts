import {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import rpc from "../electron/rpc"
import {getZealot} from "./getZealot"

export default (): Thunk<Promise<any[]>> => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const spaceIds = Handlers.getIngestSpaceIds(getState())
  return Promise.all(
    spaceIds.map((id) => {
      return zealot.spaces.delete(id).catch((e) => {
        rpc.log(`Unable to delete space: ${id}, reason: ${JSON.stringify(e)}`)
      })
    })
  )
}
