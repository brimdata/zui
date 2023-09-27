import {OperationName, Operations} from "src/domain/messages"

export function invoke<K extends OperationName>(
  name: K,
  ...args: Parameters<Operations[K]>
): Promise<Awaited<ReturnType<Operations[K]>>> {
  return global.zui.invoke(name, ...args)
}
