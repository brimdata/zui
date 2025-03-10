import {State} from "src/js/state/types"
import {getMainObject} from "./index"

export function select<T extends (state: State, ...args: any) => any>(
  selector: T
): ReturnType<T> {
  const main = getMainObject()
  return selector(main.store.getState())
}
