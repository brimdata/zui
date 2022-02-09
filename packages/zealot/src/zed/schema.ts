import {TypeAlias} from "./types/type-alias"
import {TypeRecord} from "./types/type-record"
import {flatColumns} from "./utils/flat-columns"
import {trueType} from "./utils/true-type"

export class Schema {
  constructor(
    public name: string | number,
    public type: TypeRecord | TypeAlias
  ) {}

  flatColumns() {
    return flatColumns(trueType(this.type))
  }
}
