import {Dispatch} from "src/js/state/types"
import {Correlation} from "./types"

export class CorrelationsApi {
  public configs: Correlation[] = []

  constructor(public dispatch: Dispatch) {}

  add(c: Correlation) {
    this.configs.push(c)
  }

  remove(id: string) {
    this.configs = this.configs.filter((c) => c.id !== id)
  }
}
