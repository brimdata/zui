import ZuiApi from "src/js/api/zui-api"
import {MenuItem} from "./types"

export type MenuContext = {
  api: ZuiApi // deprecated
  select<Fn extends (...a: any[]) => any>(selector: Fn): ReturnType<Fn>
}

let context: MenuContext | null = null

export function setMenuContext(ctx: MenuContext) {
  context = ctx
}

type Builder<Args extends any[]> = (
  context: MenuContext,
  ...args: Args
) => MenuItem[]

export function createMenu<Args extends any[]>(builder: Builder<Args>) {
  function build(...args: Args) {
    return builder(context, ...args)
  }
  return build
}
