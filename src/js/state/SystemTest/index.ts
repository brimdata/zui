import env from "app/core/env"

export type HookName =
  | "import-start"
  | "import-complete"
  | "export-start"
  | "export-complete"
  | "queries-export-complete"
  | "modal-entering"
  | "modal-entered"
  | "pool-deleted"

export type SystemTestState = HookName[]

function reducer(state: SystemTestState = [], action) {
  if (action.type === "SYSTEM_TEST_HOOK") {
    return [...state, action.hook]
  }
  return state
}

function hook(hook: HookName) {
  return {type: "SYSTEM_TEST_HOOK", hook}
}

function getHooks(state): SystemTestState {
  return state.systemTest
}

export default {
  reducer: env.isIntegrationTest ? reducer : (s = []) => s,
  hook,
  getHooks
}
