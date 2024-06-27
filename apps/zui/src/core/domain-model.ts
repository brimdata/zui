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

  public attrs: Attrs

  constructor(attrs: Attrs) {
    // Since these attrs often come from redux, they may be non-extensible.
    // Cloning them makes them regular objects again.
    this.attrs = {...attrs}
  }

  protected dispatch(action: Parameters<Dispatch>[0]) {
    return DomainModel.dispatch(action)
  }

  protected select<T extends Selector>(selector: T): ReturnType<T> {
    return DomainModel.select(selector)
  }
}
