import {Dispatch, State, Store} from "src/js/state/types"

type Selector = (state: State, ...args: any) => any

export class ApplicationRunner {
  static store: Store

  static select<T extends Selector>(selector: T): ReturnType<T> {
    return selector(this.store.getState())
  }

  static dispatch(action: Parameters<Dispatch>[0]) {
    return this.store.dispatch(action)
  }

  protected dispatch(action: Parameters<Dispatch>[0]) {
    return ApplicationRunner.dispatch(action)
  }

  protected select<T extends Selector>(selector: T): ReturnType<T> {
    return ApplicationRunner.select(selector)
  }
}
