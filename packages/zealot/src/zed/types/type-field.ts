import {trueType} from "../utils/true-type"
import {TypeRecord} from "./type-record"
import {Type} from "./types"

export class TypeField {
  constructor(
    public name: string,
    public type: Type,
    public parent?: TypeField | TypeRecord
  ) {}

  get path() {
    let path: string[] = [this.name]
    let parent = this.parent
    while (parent && parent instanceof TypeField) {
      path.unshift(parent.name)
      parent = parent.parent
    }
    return path
  }

  get rootRecord() {
    let parent = this.parent
    while (parent && parent instanceof TypeField) {
      parent = parent.parent
    }
    if (trueType(parent) instanceof TypeRecord) return parent
    else return null
  }
}
