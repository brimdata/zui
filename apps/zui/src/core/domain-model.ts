import {Dispatch, State, Store} from "src/js/state/types"

type Selector = (state: State, ...args: any) => any

export class DomainModel<Attrs extends {} = {}> {
  static store: Store

  static select<T extends Selector>(selector: T): ReturnType<T> {
    return selector(this.store.getState())
  }

  static dispatch(action: Parameters<Dispatch>[0]) {
    return this.store.dispatch(action)
  }

  constructor(public attrs: Attrs) {}

  protected dispatch(action: Parameters<Dispatch>[0]) {
    return DomainModel.dispatch(action)
  }

  protected select<T extends Selector>(selector: T): ReturnType<T> {
    return DomainModel.select(selector)
  }
}
