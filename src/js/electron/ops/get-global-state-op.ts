import {getPersistedGlobalState} from "src/js/state/stores/get-persistable"
import {createOperation} from "../operations"

export const getGlobalStateOp = createOperation("getGlobalState", ({main}) => {
  return getPersistedGlobalState(main.store.getState())
})
