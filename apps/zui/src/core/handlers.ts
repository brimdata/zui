import {AppDispatch} from "src/js/state/types"
import {HandlerName} from "src/domain/messages"
import {invoke} from "./invoke"

export type HandlerContext = {
  dispatch: AppDispatch
  select<Fn extends (...a: any[]) => any>(selector: Fn): ReturnType<Fn>
  invoke: typeof invoke
}

let context: HandlerContext | null = null

export function setHandlerContext(ctx: HandlerContext) {
  context = ctx
}

export function createHandler<K extends HandlerName, Args extends any[], Ret>(
  message: K,
  handler: (context: HandlerContext, ...args: Args) => Ret
) {
  function run(...args: Args) {
    return handler(context, ...args)
  }

  global.zui?.on(message, (_event, ...args: Args) => {
    run(...args)
  })

  return run
}
