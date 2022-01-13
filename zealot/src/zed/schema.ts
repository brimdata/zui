import {trueType, TypeAlias} from "./index"
import {TypeRecord} from "./types/type-record"
import {flatColumns} from "./utils"

export class Schema {
  constructor(
    public name: string | number,
    public type: TypeRecord | TypeAlias
  ) {}

  flatColumns() {
    return flatColumns(trueType(this.type))
  }
}
