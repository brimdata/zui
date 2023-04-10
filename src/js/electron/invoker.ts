import {Operation} from "./operations"

export function createInvoker<Op extends Operation<unknown[], unknown>>(
  name: string
) {
  return (
    ...args: Parameters<Op["run"]>
  ): PromiseLike<ReturnType<Op["run"]>> => {
    return global.zui.invoke(name, ...args) as PromiseLike<
      ReturnType<Op["run"]>
    >
  }
}
