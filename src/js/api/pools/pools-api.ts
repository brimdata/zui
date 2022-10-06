import deletePools from "src/js/flows/deletePools"
import {Dispatch} from "src/js/state/types"
import {load} from "./load"

export class PoolsApi {
  constructor(private dispatch: Dispatch) {}

  load(files: File[]) {
    return this.dispatch(load(files))
  }

  delete(id: string | string[]) {
    const ids = Array.isArray(id) ? id : [id]
    return this.dispatch(deletePools(ids))
  }
}
