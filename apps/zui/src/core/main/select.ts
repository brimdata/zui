import {State} from "src/js/state/types"
import {withMain} from "./with-main"

export function select<T extends (state: State, ...args: any) => any>(
  selector: T
): ReturnType<T> {
  return withMain((main) => {
    return selector(main.store.getState())
  })
}
