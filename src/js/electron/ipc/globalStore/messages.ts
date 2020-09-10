import {GlobalStoreDispatchMsg, GlobalStoreInitMsg} from "../types"

export default {
  init: (): GlobalStoreInitMsg => ({
    channel: "globalStore:init"
  }),
  dispatch: (action: object): GlobalStoreDispatchMsg => ({
    channel: "globalStore:dispatch",
    action
  })
}
