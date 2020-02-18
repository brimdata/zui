/* @flow */
import type {MainStoreDispatchMsg, MainStoreInitMsg} from "../types"

export default {
  init: (): MainStoreInitMsg => ({
    channel: "mainStore:init"
  }),
  dispatch: (action: any): MainStoreDispatchMsg => ({
    channel: "mainStore:dispatch",
    action
  })
}
