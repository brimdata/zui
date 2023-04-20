import {AppDispatch} from "src/js/state/types"
import {MessageName, Messages} from "./messages"

export type HandlerContext = {
  dispatch: AppDispatch
  select<Fn extends (...a: any[]) => any>(selector: Fn): ReturnType<Fn>
}

let context: HandlerContext | null = null

export function setHandlerContext(ctx: HandlerContext) {
  context = ctx
}

export function createHandler<K extends MessageName>(
  message: K,
  handler: (context: HandlerContext, ...args: Messages[K]) => void
) {
  global.zui?.listen(message, (_event, ...args: Messages[K]) => {
    handler(context, ...args)
  })
}
