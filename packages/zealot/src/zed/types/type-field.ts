import {trueType} from "../utils/true-type"
import {TypeRecord} from "./type-record"
import {Type} from "./types"

export class TypeField {
  constructor(public name: string, public type: Type) {}
}
