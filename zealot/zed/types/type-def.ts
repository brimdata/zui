import {ZedType} from "./types"

export class TypeDef {
  kind = "typedef"

  constructor(public name: string, public type: ZedType) {}

  create(value) {
    console.log(value)
    throw new Error("Im here!")
  }
}
