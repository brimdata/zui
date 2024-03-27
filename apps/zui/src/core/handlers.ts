import {AppDispatch} from "src/js/state/types"
import {HandlerName} from "src/domain/messages"
import {invoke} from "./invoke"
import toast from "react-hot-toast"
import {isFunction, isString} from "lodash"
import ZuiApi from "src/js/api/zui-api"
import {startTransition} from "react"
import {createWaitForSelector} from "src/app/core/state/create-wait-for-selector"
import {AsyncTasks} from "src/modules/async-tasks"

export type HandlerContext = {
  dispatch: AppDispatch
  select<Fn extends (...a: any[]) => any>(selector: Fn): ReturnType<Fn>
  waitForSelector: ReturnType<typeof createWaitForSelector>
  invoke: typeof invoke
  toast: typeof toast
  oldApi: ZuiApi
  transition: typeof startTransition
  asyncTasks: AsyncTasks
}

let context: HandlerContext | null = null

export function setHandlerContext(ctx: HandlerContext) {
  context = ctx
}

type Handler<Args extends any[], Ret> = (
  context: HandlerContext,
  ...args: Args
) => Ret

export function createHandler<K extends HandlerName, Args extends any[], Ret>(
  messageOrHandler: K | Handler<Args, Ret>,
  handler?: Handler<Args, Ret>
) {
  const message = isString(messageOrHandler) ? messageOrHandler : null
  const handleIt = isFunction(messageOrHandler) ? messageOrHandler : handler

  function run(...args: Args) {
    return handleIt(context, ...args)
  }

  if (message) {
    global.zui?.on(message, (_event, ...args: Args) => {
      run(...args)
    })
  }

  return run
}
