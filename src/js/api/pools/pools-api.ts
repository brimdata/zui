import {Dispatch} from "src/js/state/types"
import {load} from "./load"

export class PoolsApi {
  constructor(private dispatch: Dispatch) {}

  load(files: File[]) {
    return this.dispatch(load(files))
  }
}
