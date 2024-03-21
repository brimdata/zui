import {AnyAction} from "@reduxjs/toolkit"
import {State, Store} from "src/js/state/types"

type Selector = (state: State, ...args: any) => any

export class DomainModel<Attrs> {
  static store: Store

  static select<T extends Selector>(selector: T): ReturnType<T> {
    return selector(this.store.getState())
  }

  static dispatch(action: AnyAction) {
    return this.store.dispatch(action)
  }

  constructor(public attrs: Attrs) {}

  protected dispatch(action: AnyAction) {
    return DomainModel.dispatch(action)
  }

  protected select<T extends Selector>(selector: T): ReturnType<T> {
    return DomainModel.select(selector)
  }
}
