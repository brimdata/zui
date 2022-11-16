import BrimApi from "."
import {State} from "../state/types"

export class ApiDomain {
  constructor(private base: BrimApi) {}

  get state() {
    return this.base.getState()
  }

  get dispatch() {
    return this.base.dispatch
  }

  get zealot() {
    return this.base.getZealot()
  }

  get lakeId() {
    return this.base.current.lakeId
  }

  get configs() {
    return this.base.configs
  }

  get loaders() {
    return this.base.loaders
  }

  get abortables() {
    return this.base.abortables
  }

  select<R>(selector: (state: State) => R) {
    return selector(this.state)
  }
}
