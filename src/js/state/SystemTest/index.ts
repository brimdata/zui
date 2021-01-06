export type HookName =
  | "import-start"
  | "import-complete"
  | "export-start"
  | "export-complete"
  | "modal-entering"
  | "modal-entered"

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
  reducer: process.env.BRIM_ITEST === "true" ? reducer : (s = []) => s,
  hook,
  getHooks
}
