import {getPersistedGlobalState} from "src/js/state/getPersistable"
import {createOperation} from "../operations"

export const getGlobalStateOp = createOperation("getGlobalState", (main) => {
  return getPersistedGlobalState(main.store.getState())
})
