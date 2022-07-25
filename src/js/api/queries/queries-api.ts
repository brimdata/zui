import {JSONGroup} from "../../state/Queries/parsers"
import {AppDispatch} from "../../state/types"
import {queriesExport} from "./export"
import {queriesImport} from "./import"

export class QueriesApi {
  constructor(private dispatch: AppDispatch) {}

  import(file: File) {
    return this.dispatch(queriesImport(file))
  }

  export(groupId: string): JSONGroup {
    return this.dispatch(queriesExport(groupId))
  }
}
