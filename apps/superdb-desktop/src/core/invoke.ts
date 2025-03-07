import {OperationName, Operations} from "src/domain/messages"

export function invoke<K extends OperationName>(
  name: K,
  ...args: Parameters<Operations[K]>
): Promise<Awaited<ReturnType<Operations[K]>>> {
  return global.zui.invoke(name, ...args).catch((error) => {
    throw new Error(
      error
        .toString()
        // Here we are stripping the error prefix that electron tacks on.
        .replace(`Error: Error invoking remote method '${name}': `, "")
    )
  })
}
