/* @flow */
import type {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import rpc from "../electron/rpc"
import Current from "../state/Current"

export default (): Thunk => (_, getState, {createZealot}) => {
  const zealot = createZealot(Current.getConnectionId(getState()))
  let spaceIds = Handlers.getIngestSpaceIds(getState())
  return Promise.all(
    spaceIds.map((id) => {
      rpc.log("starting delete for", id)
      return zealot.spaces
        .delete(id)
        .then(() => {
          rpc.log("Deleted", id)
        })
        .catch((e) => {
          rpc.log(`Unable to delete space: ${id}, reason: ${JSON.stringify(e)}`)
        })
    })
  )
}
