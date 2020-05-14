/* @flow */
import type {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import Tab from "../state/Tab"
import rpc from "../electron/rpc"

export default (): Thunk => (_, getState) => {
  let client = Tab.getZealot(getState())
  let spaceIds = Handlers.getIngestSpaceIds(getState())
  return Promise.all(
    spaceIds.map((id) => {
      rpc.log("starting delete for", id)
      return client.spaces
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
