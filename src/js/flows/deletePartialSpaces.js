/* @flow */
import type {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import Tab from "../state/Tab"
import rpc from "../electron/rpc"

export default (): Thunk => (_, getState) => {
  let client = Tab.getZealot(getState())
  let spaces = Handlers.getIngestSpaceNames(getState())
  return Promise.all(
    spaces.map((name) => {
      rpc.log("starting delete for", name)
      return client.spaces
        .delete(name)
        .then(() => {
          rpc.log("Deleted", name)
        })
        .catch((e) => {
          rpc.log(`Unable to delete space: ${name}, reason: ${e}`)
        })
    })
  )
}
