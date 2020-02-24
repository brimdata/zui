/* @flow */
import type {GlobalStoreDispatchMsg, GlobalStoreInitMsg} from "../types"

export default {
  init: (): GlobalStoreInitMsg => ({
    channel: "globalStore:init"
  }),
  dispatch: (action: any): GlobalStoreDispatchMsg => ({
    channel: "globalStore:dispatch",
    action
  })
}
