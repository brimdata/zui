import {dispatchGlobalOp} from "../electron/ops/global-dispatch-op"

export const globalDispatchMiddleware = (_store) => (next) => (action) => {
  const result = next(action)
  if (action.type.startsWith("$") && !action.remote) {
    // Don't re-broadcast a message that was broadcast to you
    dispatchGlobalOp.invoke(action).catch((e) => {
      console.error(e)
    })
  }
  return result
}
