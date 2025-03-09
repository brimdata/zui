import {getPersistedGlobalState} from "src/js/state/stores/get-persistable"
import {createOperation} from "../../core/operations"
import {pick} from "lodash"

const GLOBAL_STATE_KEYS = ["updates"]

export const getGlobalStateOp = createOperation("getGlobalState", ({main}) => {
  const state = main.store.getState()
  // Any global state that we persist should be
  // sent to new windows being created.
  // But also data that is relevant, but not persisted.
  return {
    ...getPersistedGlobalState(state),
    ...pick(state, GLOBAL_STATE_KEYS),
  }
})
